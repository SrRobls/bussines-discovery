import type { BusinessInput, PlaceReview } from "../types/business.js";
import {
  boundingBox,
  type LatLng,
  pointInPolygon,
  polygonCentroid,
} from "../utils/geo.js";
import { normalizeNiche, normalizeZone } from "../utils/normalize.js";

const PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const MAX_PAGES = 3; // Google permite hasta ~60 resultados (20 × 3)
const PAGE_SIZE = 20;

const SEARCH_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.primaryType",
  "places.location",
  "nextPageToken",
].join(",");

const DETAILS_FIELD_MASK = "reviews,rating,userRatingCount";

interface PlacesLocation {
  latitude?: number;
  longitude?: number;
}

interface PlacesResult {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  primaryType?: string;
  location?: PlacesLocation;
}

interface PlacesResponse {
  places?: PlacesResult[];
  nextPageToken?: string;
}

interface ReviewRaw {
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  authorAttribution?: { displayName?: string };
}

interface PlaceDetailsResponse {
  reviews?: ReviewRaw[];
}

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY no está configurada en .env");
  }
  return apiKey;
}

function mapPlaceToInput(
  place: PlacesResult,
  meta: {
    niche: string;
    searched_zone: string;
    search_mode: string;
    reviews: PlaceReview[];
  }
): BusinessInput | null {
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;
  if (lat == null || lng == null) return null;

  return {
    name: place.displayName?.text?.trim() || "Sin nombre",
    rating: place.rating ?? null,
    user_ratings_total: place.userRatingCount ?? null,
    address: place.formattedAddress ?? null,
    phone: place.nationalPhoneNumber ?? null,
    website: place.websiteUri ?? null,
    category: place.primaryType ?? null,
    latitude: lat,
    longitude: lng,
    niche: meta.niche,
    searched_zone: meta.searched_zone,
    google_place_id: place.id ?? null,
    reviews: meta.reviews,
    search_mode: meta.search_mode,
  };
}

function mapReviews(raw: ReviewRaw[] | undefined): PlaceReview[] {
  if (!raw?.length) return [];
  return raw
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? null,
      rating: r.rating ?? null,
      text: r.text?.text?.trim() ?? "",
      relative_time: r.relativePublishTimeDescription ?? null,
    }))
    .filter((r) => r.text.length > 0);
}

async function fetchPlaceReviews(placeId: string): Promise<PlaceReview[]> {
  const apiKey = getApiKey();
  const id = placeId.replace(/^places\//, "");
  const url = `https://places.googleapis.com/v1/places/${id}`;

  const response = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": DETAILS_FIELD_MASK,
    },
  });

  if (!response.ok) {
    console.warn(`Place Details falló para ${placeId}: ${response.status}`);
    return [];
  }

  const data = (await response.json()) as PlaceDetailsResponse;
  return mapReviews(data.reviews);
}

async function enrichWithReviews(
  places: PlacesResult[]
): Promise<Map<string, PlaceReview[]>> {
  const reviewsById = new Map<string, PlaceReview[]>();
  const withId = places.filter((p) => p.id);

  // Secuencial para no saturar cuota; MVP prioriza estabilidad
  for (const place of withId) {
    if (!place.id) continue;
    try {
      const reviews = await fetchPlaceReviews(place.id);
      reviewsById.set(place.id, reviews);
    } catch {
      reviewsById.set(place.id, []);
    }
  }

  return reviewsById;
}

async function searchTextPages(
  textQuery: string,
  locationRestriction?: {
    rectangle: {
      low: { latitude: number; longitude: number };
      high: { latitude: number; longitude: number };
    };
  }
): Promise<PlacesResult[]> {
  const apiKey = getApiKey();
  const all: PlacesResult[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const body: Record<string, unknown> = {
      textQuery,
      pageSize: PAGE_SIZE,
    };
    if (locationRestriction) body.locationRestriction = locationRestriction;
    if (pageToken) body.pageToken = pageToken;

    const response = await fetch(PLACES_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": SEARCH_FIELD_MASK,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        `Google Places API error (${response.status}): ${errBody || response.statusText}`
      );
    }

    const data = (await response.json()) as PlacesResponse;
    all.push(...(data.places ?? []));
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return all;
}

function dedupePlaces(places: PlacesResult[]): PlacesResult[] {
  const seen = new Set<string>();
  return places.filter((p) => {
    const key = p.id ?? `${p.displayName?.text}-${p.location?.latitude}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function finalizePlaces(
  places: PlacesResult[],
  meta: { niche: string; searched_zone: string; search_mode: string },
  polygon?: LatLng[]
): Promise<BusinessInput[]> {
  let filtered = places;

  if (polygon && polygon.length >= 3) {
    filtered = places.filter((p) => {
      const lat = p.location?.latitude;
      const lng = p.location?.longitude;
      if (lat == null || lng == null) return false;
      return pointInPolygon({ lat, lng }, polygon);
    });
  }

  const unique = dedupePlaces(filtered);
  const reviewsMap = await enrichWithReviews(unique);

  const results: BusinessInput[] = [];
  for (const place of unique) {
    const reviews = place.id ? (reviewsMap.get(place.id) ?? []) : [];
    const row = mapPlaceToInput(place, { ...meta, reviews });
    if (row) results.push(row);
  }

  return results;
}

/** Búsqueda clásica: nicho + zona (hasta 60 resultados con paginación) */
export async function searchPlaces(
  niche: string,
  zone: string
): Promise<BusinessInput[]> {
  const nicheNorm = normalizeNiche(niche);
  const zoneNorm = normalizeZone(zone);
  const textQuery = `${nicheNorm} en ${zoneNorm}`;
  const places = await searchTextPages(textQuery);

  return finalizePlaces(places, {
    niche: nicheNorm,
    searched_zone: zoneNorm,
    search_mode: "text",
  });
}

/** Búsqueda por polígono dibujado en mapa; nicho opcional */
export async function searchPlacesInPolygon(
  polygon: LatLng[],
  niche?: string
): Promise<BusinessInput[]> {
  if (polygon.length < 3) {
    throw new Error("El polígono debe tener al menos 3 puntos.");
  }

  const bbox = boundingBox(polygon);
  const center = polygonCentroid(polygon);
  const nicheLabel = niche?.trim()
    ? normalizeNiche(niche)
    : "todos los negocios";
  const zoneLabel = `mapa:${center.lat.toFixed(4)},${center.lng.toFixed(4)}`;

  const textQuery = niche?.trim()
    ? normalizeNiche(niche)
    : "establecimientos comerciales negocios locales";

  const places = await searchTextPages(textQuery, {
    rectangle: bbox,
  });

  return finalizePlaces(
    places,
    {
      niche: nicheLabel,
      searched_zone: zoneLabel,
      search_mode: "map",
    },
    polygon
  );
}

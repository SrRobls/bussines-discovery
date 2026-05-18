const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export interface PlaceReview {
  author: string | null;
  rating: number | null;
  text: string;
  relative_time: string | null;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Business {
  id: string;
  name: string;
  rating: number | null;
  user_ratings_total: number | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  niche: string;
  searched_zone: string;
  google_place_id: string | null;
  reviews: PlaceReview[];
  search_mode: string;
  created_at: string;
}

export interface SearchParams {
  mode: "text" | "map";
  niche?: string;
  zone?: string;
  polygon?: LatLng[];
}

interface SearchResponse {
  query: string;
  count: number;
  maxPerSearch?: number;
  note?: string;
  businesses: Business[];
  newBusinesses: Business[];
  existingBusinesses: Business[];
  storedInDb: Business[];
  stats?: {
    newCount: number;
    updatedCount: number;
    storedCount: number;
  };
  niche?: string;
  zone?: string;
}

interface ListResponse {
  count: number;
  businesses: Business[];
}

export interface ListFilters {
  niche?: string;
  zone?: string;
}

interface ApiError {
  error: string;
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T | ApiError;
  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err.error ?? `Error ${res.status}`);
  }
  return data as T;
}

export async function searchBusinesses(
  params: SearchParams
): Promise<SearchResponse> {
  const res = await fetch(`${API_URL}/api/businesses/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return parseJson<SearchResponse>(res);
}

export async function listBusinesses(
  filters?: ListFilters
): Promise<Business[]> {
  const params = new URLSearchParams();
  if (filters?.niche) params.set("niche", filters.niche);
  if (filters?.zone) params.set("zone", filters.zone);
  const qs = params.toString();
  const res = await fetch(
    `${API_URL}/api/businesses${qs ? `?${qs}` : ""}`
  );
  const data = await parseJson<ListResponse>(res);
  return data.businesses.map((b) => ({
    ...b,
    reviews: Array.isArray(b.reviews) ? b.reviews : [],
  }));
}

export type ExportBucket = "new" | "stored" | "all";

export interface ExportCsvOptions {
  bucket?: ExportBucket;
  niche?: string;
  zone?: string;
  ids?: string[];
}

export function exportCsvUrl(options: ExportCsvOptions = {}): string {
  const params = new URLSearchParams();
  if (options.bucket) params.set("bucket", options.bucket);
  if (options.niche) params.set("niche", options.niche);
  if (options.zone) params.set("zone", options.zone);
  if (options.ids?.length) params.set("ids", options.ids.join(","));
  const qs = params.toString();
  return `${API_URL}/api/businesses/export${qs ? `?${qs}` : ""}`;
}

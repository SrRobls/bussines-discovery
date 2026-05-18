import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Business, BusinessInput } from "../types/business.js";
import { normalizeNiche, normalizeZone } from "../utils/normalize.js";

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env"
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export function placeKey(row: {
  google_place_id: string | null;
  name: string;
  latitude: number | null;
  longitude: number | null;
}): string {
  if (row.google_place_id) return row.google_place_id;
  return `${row.name}|${row.latitude ?? ""}|${row.longitude ?? ""}`;
}

/** Fuerza nicho + zona normalizados en cada fila (misma clave de búsqueda). */
export function attachNicheZone(
  rows: BusinessInput[],
  niche: string,
  zone: string
): BusinessInput[] {
  const nicheNorm = normalizeNiche(niche);
  const zoneNorm = normalizeZone(zone);
  return rows.map((r) => ({
    ...r,
    niche: nicheNorm,
    searched_zone: zoneNorm,
  }));
}

function normalizeRows(data: unknown): Business[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const r = row as Business & { reviews?: unknown };
    return {
      ...r,
      reviews: Array.isArray(r.reviews) ? r.reviews : [],
      google_place_id: r.google_place_id ?? null,
      search_mode: r.search_mode ?? "text",
    };
  });
}

export interface ListFilters {
  niche?: string;
  zone?: string;
}

export async function listBusinesses(filters?: ListFilters): Promise<Business[]> {
  let query = getClient().from("businesses").select("*");

  if (filters?.niche?.trim()) {
    query = query.eq("niche", normalizeNiche(filters.niche));
  }
  if (filters?.zone?.trim()) {
    query = query.eq("searched_zone", normalizeZone(filters.zone));
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error listando negocios: ${error.message}`);
  }

  return normalizeRows(data);
}

export async function getBusinessesByIds(ids: string[]): Promise<Business[]> {
  if (ids.length === 0) return [];
  const { data, error } = await getClient()
    .from("businesses")
    .select("*")
    .in("id", ids);

  if (error) {
    throw new Error(`Error obteniendo negocios: ${error.message}`);
  }
  return normalizeRows(data);
}

export interface ExportFilters {
  niche?: string;
  zone?: string;
  ids?: string[];
  /** stored = en BD para nicho+zona; new/existing se resuelven por ids en la ruta */
  bucket?: "all" | "stored";
}

export async function listBusinessesForExport(
  filters: ExportFilters
): Promise<Business[]> {
  if (filters.ids?.length) {
    return getBusinessesByIds(filters.ids);
  }
  if (filters.bucket === "stored" || filters.bucket === "all") {
    return listBusinesses({
      niche: filters.niche,
      zone: filters.zone,
    });
  }
  return listBusinesses();
}

export interface SyncResult {
  newBusinesses: Business[];
  existingBusinesses: Business[];
  all: Business[];
}

/**
 * Inserta nuevos y actualiza existentes para el mismo nicho + zona.
 * Clasificación por google_place_id (o nombre+coords) solo dentro de ese par nicho/zona.
 */
export async function syncBusinesses(
  rows: BusinessInput[],
  niche: string,
  zone: string
): Promise<SyncResult> {
  if (rows.length === 0) {
    return { newBusinesses: [], existingBusinesses: [], all: [] };
  }

  const normalized = attachNicheZone(rows, niche, zone);
  const nicheNorm = normalizeNiche(niche);
  const zoneNorm = normalizeZone(zone);

  const existing = await listBusinesses({ niche: nicheNorm, zone: zoneNorm });
  const existingByKey = new Map(existing.map((b) => [placeKey(b), b]));

  const toInsert: BusinessInput[] = [];
  const toUpdate: { id: string; row: BusinessInput }[] = [];

  for (const row of normalized) {
    const key = placeKey(row);
    const prev = existingByKey.get(key);
    if (prev) {
      toUpdate.push({ id: prev.id, row });
    } else {
      toInsert.push(row);
    }
  }

  const inserted: Business[] = [];
  if (toInsert.length > 0) {
    const { data, error } = await getClient()
      .from("businesses")
      .insert(toInsert)
      .select();
    if (error) {
      throw new Error(`Error guardando en Supabase: ${error.message}`);
    }
    inserted.push(...normalizeRows(data));
  }

  const updated: Business[] = [];
  if (toUpdate.length > 0) {
    const results = await Promise.all(
      toUpdate.map(async ({ id, row }) => {
        const { data, error } = await getClient()
          .from("businesses")
          .update({
            name: row.name,
            rating: row.rating,
            user_ratings_total: row.user_ratings_total,
            address: row.address,
            phone: row.phone,
            website: row.website,
            category: row.category,
            latitude: row.latitude,
            longitude: row.longitude,
            reviews: row.reviews,
            google_place_id: row.google_place_id,
            search_mode: row.search_mode,
            niche: nicheNorm,
            searched_zone: zoneNorm,
          })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          throw new Error(`Error actualizando negocio: ${error.message}`);
        }
        return data;
      })
    );
    updated.push(...normalizeRows(results));
  }

  const all = [...inserted, ...updated];
  return {
    newBusinesses: inserted,
    existingBusinesses: updated,
    all,
  };
}

/** Registros en BD para nicho+zona que NO son los recién insertados en esta búsqueda. */
export async function listStoredExcludingNew(
  niche: string,
  zone: string,
  newIds: string[]
): Promise<Business[]> {
  const stored = await listBusinesses({ niche, zone });
  if (newIds.length === 0) return stored;
  const exclude = new Set(newIds);
  return stored.filter((b) => !exclude.has(b.id));
}

/** @deprecated Use syncBusinesses */
export async function saveBusinesses(rows: BusinessInput[]): Promise<Business[]> {
  if (rows.length === 0) return [];
  const result = await syncBusinesses(
    rows,
    rows[0].niche,
    rows[0].searched_zone
  );
  return result.all;
}

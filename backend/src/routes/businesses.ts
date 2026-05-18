import { Router, type Request, type Response } from "express";
import { businessesToCsv } from "../services/csv.js";
import {
  searchPlaces,
  searchPlacesInPolygon,
} from "../services/googlePlaces.js";
import {
  listBusinesses,
  listBusinessesForExport,
  listStoredExcludingNew,
  syncBusinesses,
} from "../services/supabase.js";
import type { SearchRequestBody } from "../types/business.js";
import { normalizeNiche, normalizeZone } from "../utils/normalize.js";

export const businessesRouter = Router();

businessesRouter.post("/search", async (req: Request, res: Response) => {
  try {
    const body = req.body as SearchRequestBody;
    const mode = body.mode ?? (body.polygon?.length ? "map" : "text");

    let found;
    let query: string;
    let nicheKey: string | undefined;
    let zoneKey: string | undefined;

    if (mode === "map" && body.polygon?.length) {
      if (body.polygon.length < 3) {
        res.status(400).json({
          error: "Dibuja un polígono con al menos 3 puntos en el mapa.",
        });
        return;
      }
      found = await searchPlacesInPolygon(body.polygon, body.niche);
      nicheKey = body.niche?.trim()
        ? normalizeNiche(body.niche)
        : "todos los negocios";
      zoneKey = found[0]?.searched_zone ?? "mapa:sin-resultados";
      if (found.length > 0) {
        nicheKey = found[0].niche;
        zoneKey = found[0].searched_zone;
      }
      query = body.niche?.trim()
        ? `${nicheKey} (zona mapa)`
        : "todos los negocios (zona mapa)";
    } else {
      const { niche, zone } = body;
      if (!niche?.trim() || !zone?.trim()) {
        res.status(400).json({
          error: 'Modo texto: "niche" y "zone" son obligatorios.',
        });
        return;
      }
      found = await searchPlaces(niche, zone);
      nicheKey = normalizeNiche(niche);
      zoneKey = normalizeZone(zone);
      query = `${nicheKey} en ${zoneKey}`;
    }

    if (!nicheKey || !zoneKey) {
      res.status(400).json({ error: "No se pudo determinar nicho y zona." });
      return;
    }

    const synced = await syncBusinesses(found, nicheKey, zoneKey);
    const newIds = synced.newBusinesses.map((b) => b.id);
    const storedInDb = await listStoredExcludingNew(nicheKey, zoneKey, newIds);

    res.json({
      query,
      count: synced.all.length,
      maxPerSearch: 60,
      note:
        "Google Places devuelve hasta 60 resultados por búsqueda (20×3 páginas). No es el universo total de la ciudad.",
      businesses: synced.all,
      newBusinesses: synced.newBusinesses,
      existingBusinesses: synced.existingBusinesses,
      storedInDb,
      stats: {
        newCount: synced.newBusinesses.length,
        updatedCount: synced.existingBusinesses.length,
        storedCount: storedInDb.length,
      },
      niche: nicheKey,
      zone: zoneKey,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[POST /search]", message);
    res.status(500).json({ error: message });
  }
});

businessesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const niche = typeof req.query.niche === "string" ? req.query.niche : undefined;
    const zone = typeof req.query.zone === "string" ? req.query.zone : undefined;
    const businesses = await listBusinesses({ niche, zone });
    res.json({ count: businesses.length, businesses });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[GET /]", message);
    res.status(500).json({ error: message });
  }
});

businessesRouter.get("/export", async (req: Request, res: Response) => {
  try {
    const niche =
      typeof req.query.niche === "string" ? req.query.niche : undefined;
    const zone =
      typeof req.query.zone === "string" ? req.query.zone : undefined;
    const bucket =
      typeof req.query.bucket === "string" ? req.query.bucket : "all";
    const idsParam =
      typeof req.query.ids === "string" ? req.query.ids : undefined;
    const ids = idsParam
      ?.split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids?.length) {
      const businesses = await listBusinessesForExport({ ids });
      const csv = businessesToCsv(businesses);
      const suffix =
        bucket === "new"
          ? "nuevos"
          : bucket === "stored"
            ? "en-bd"
            : "seleccion";
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="businesses-${suffix}.csv"`
      );
      res.send(csv);
      return;
    }

    if (bucket === "stored" || bucket === "all") {
      if (!niche?.trim() || !zone?.trim()) {
        res.status(400).json({
          error:
            'Para exportar por nicho/zona use query params "niche" y "zone", o pase "ids".',
        });
        return;
      }
    }

    const businesses = await listBusinessesForExport({
      niche,
      zone,
      bucket: bucket === "stored" ? "stored" : "all",
    });
    const csv = businessesToCsv(businesses);
    const filename =
      bucket === "stored"
        ? `businesses-${normalizeNiche(niche!)}-${normalizeZone(zone!)}-bd.csv`
        : "businesses.csv";

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[GET /export]", message);
    res.status(500).json({ error: message });
  }
});

import { Download, Loader2, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { BusinessTable } from "@/components/BusinessTable";
import { MapZonePicker, type LatLng } from "@/components/MapZonePicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  exportCsvUrl,
  searchBusinesses,
  type Business,
} from "@/lib/api";
import { normalizeNiche, normalizeZone } from "@/lib/normalize";

type Tab = "text" | "map";

export default function App() {
  const [tab, setTab] = useState<Tab>("text");
  const [niche, setNiche] = useState("");
  const [zone, setZone] = useState("");
  const [mapNiche, setMapNiche] = useState("");
  const [polygon, setPolygon] = useState<LatLng[]>([]);
  const [newBusinesses, setNewBusinesses] = useState<Business[]>([]);
  const [storedBusinesses, setStoredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [searchNote, setSearchNote] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<{
    niche?: string;
    zone?: string;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchStats, setSearchStats] = useState<{
    newCount: number;
    updatedCount: number;
    storedCount: number;
  } | null>(null);

  async function runSearch() {
    setError(null);
    setLoading(true);
    setSearchNote(null);

    try {
      const result =
        tab === "text"
          ? await searchBusinesses({
              mode: "text",
              niche: normalizeNiche(niche),
              zone: normalizeZone(zone),
            })
          : await searchBusinesses({
              mode: "map",
              niche: mapNiche.trim()
                ? normalizeNiche(mapNiche)
                : undefined,
              polygon,
            });

      setNewBusinesses(result.newBusinesses ?? []);
      setStoredBusinesses(result.storedInDb ?? []);
      setLastQuery(result.query);
      setSearchNote(result.note ?? null);
      setHasSearched(true);
      setSearchStats(result.stats ?? null);

      const filter = {
        niche: result.niche,
        zone: result.zone,
      };
      setActiveFilter(filter.niche || filter.zone ? filter : null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error en la búsqueda";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleTextSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!niche.trim() || !zone.trim()) return;
    await runSearch();
  }

  async function handleMapSearch() {
    if (polygon.length < 3) {
      setError("Dibuja una zona en el mapa (trazo libre, mínimo 3 puntos).");
      return;
    }
    await runSearch();
  }

  function handleNicheBlur(isMap: boolean) {
    if (isMap && mapNiche.trim()) {
      setMapNiche(normalizeNiche(mapNiche));
    } else if (!isMap && niche.trim()) {
      setNiche(normalizeNiche(niche));
    }
  }

  function handleZoneBlur() {
    if (zone.trim()) setZone(normalizeZone(zone));
  }

  const showEmpty =
    !loading && hasSearched && newBusinesses.length === 0 && storedBusinesses.length === 0;

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          <MapPin className="h-7 w-7 text-[var(--color-primary)]" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Business Discovery MVP
            </h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Nicho/zona normalizados · comparación con BD · paginación · mapa
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-1">
          <button
            type="button"
            onClick={() => setTab("text")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === "text"
                ? "bg-[var(--color-card)] shadow-sm"
                : "text-[var(--color-muted-foreground)]"
            }`}
          >
            Por texto (nicho + zona)
          </button>
          <button
            type="button"
            onClick={() => setTab("map")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === "map"
                ? "bg-[var(--color-card)] shadow-sm"
                : "text-[var(--color-muted-foreground)]"
            }`}
          >
            Por mapa (dibujar zona)
          </button>
        </div>

        {tab === "text" ? (
          <Card>
            <CardHeader>
              <CardTitle>Buscar por nicho y zona</CardTitle>
              <CardDescription>
                El nicho y la zona se guardan en minúsculas y sin tildes para
                comparar con la BD. Google devuelve hasta 60 resultados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleTextSearch}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"
              >
                <div className="space-y-2">
                  <label htmlFor="niche" className="text-sm font-medium">
                    Nicho
                  </label>
                  <Input
                    id="niche"
                    placeholder="odontologia, veterinaria…"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    onBlur={() => handleNicheBlur(false)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="zone" className="text-sm font-medium">
                    Zona
                  </label>
                  <Input
                    id="zone"
                    placeholder="laureles medellin, parque berrio…"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    onBlur={handleZoneBlur}
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Buscando…
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Buscar en zona del mapa</CardTitle>
              <CardDescription>
                Mueve el mapa con la mano; dibuja la zona con trazo libre. Nicho
                opcional (se normaliza igual que en texto).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-w-md space-y-2">
                <label htmlFor="map-niche" className="text-sm font-medium">
                  Nicho (opcional)
                </label>
                <Input
                  id="map-niche"
                  placeholder="odontologia, restaurante… o vacío"
                  value={mapNiche}
                  onChange={(e) => setMapNiche(e.target.value)}
                  onBlur={() => handleNicheBlur(true)}
                />
              </div>
              <MapZonePicker polygon={polygon} onPolygonChange={setPolygon} />
              <Button
                type="button"
                onClick={() => void handleMapSearch()}
                disabled={loading || polygon.length < 3}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Buscando en zona…
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Buscar en zona dibujada
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Resultados</h2>
            {lastQuery && (
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Última búsqueda: {lastQuery}
              </p>
            )}
            {activeFilter?.niche && (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Filtro BD: nicho «{activeFilter.niche}»
                {activeFilter.zone ? ` · zona «${activeFilter.zone}»` : ""}
              </p>
            )}
            {searchNote && (
              <p className="text-xs text-amber-700">{searchNote}</p>
            )}
            {searchStats && (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Esta búsqueda: {searchStats.newCount} nuevos guardados ·{" "}
                {searchStats.updatedCount} actualizados ·{" "}
                {searchStats.storedCount} ya en BD (sin duplicar con nuevos)
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={!hasSearched || newBusinesses.length === 0}
            >
              <a
                href={exportCsvUrl({
                  bucket: "new",
                  ids: newBusinesses.map((b) => b.id),
                })}
                download="businesses-nuevos.csv"
              >
                <Download className="h-4 w-4" />
                Solo nuevos ({newBusinesses.length})
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={!hasSearched || storedBusinesses.length === 0}
            >
              <a
                href={exportCsvUrl({
                  bucket: "stored",
                  ids: storedBusinesses.map((b) => b.id),
                })}
                download="businesses-en-bd.csv"
              >
                <Download className="h-4 w-4" />
                Solo en BD ({storedBusinesses.length})
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={
                !activeFilter?.niche ||
                !activeFilter?.zone ||
                newBusinesses.length + storedBusinesses.length === 0
              }
            >
              <a
                href={exportCsvUrl({
                  bucket: "all",
                  niche: activeFilter?.niche,
                  zone: activeFilter?.zone,
                })}
                download="businesses-nicho-zona.csv"
              >
                <Download className="h-4 w-4" />
                Todo nicho + zona
              </a>
            </Button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-[var(--color-muted-foreground)]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Consultando API y comparando con BD…
          </div>
        )}

        {!loading && !hasSearched && (
          <Card>
            <CardContent className="py-12 text-center text-[var(--color-muted-foreground)]">
              Haz una búsqueda para ver negocios nuevos y los ya guardados en BD
              para ese nicho y zona.
            </CardContent>
          </Card>
        )}

        {showEmpty && !error && (
          <Card>
            <CardContent className="py-12 text-center text-[var(--color-muted-foreground)]">
              No hay resultados para esta búsqueda.
            </CardContent>
          </Card>
        )}

        {!loading && hasSearched && (
          <div className="space-y-8">
            <BusinessTable
              businesses={newBusinesses}
              title="Nuevos en esta búsqueda"
              description="Insertados ahora en BD para este nicho y zona. No aparecen en la tabla de abajo."
              emptyMessage="No hay negocios nuevos; todos ya existían en BD."
            />
            <BusinessTable
              businesses={storedBusinesses}
              title="Ya en base de datos (mismo nicho + zona)"
              description="Registros que ya existían para este nicho y zona (incluye actualizados en esta búsqueda)."
              emptyMessage="No hay registros guardados para este filtro."
            />
          </div>
        )}
      </main>
    </div>
  );
}

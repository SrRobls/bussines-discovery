import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Business } from "@/lib/api";

const PAGE_SIZE = 10;

function formatRating(value: number | null): string {
  return value == null ? "—" : value.toFixed(1);
}

function hasWebsite(b: Business): boolean {
  return Boolean(b.website?.trim());
}

interface BusinessTableProps {
  businesses: Business[];
  title?: string;
  description?: string;
  emptyMessage?: string;
}

export function BusinessTable({
  businesses,
  title,
  description,
  emptyMessage = "Sin registros.",
}: BusinessTableProps) {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [businesses]);

  const totalPages = Math.max(1, Math.ceil(businesses.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return businesses.slice(start, start + PAGE_SIZE);
  }, [businesses, safePage]);

  if (businesses.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {(title || description) && (
        <div>
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full min-w-[1150px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium"># reseñas</th>
              <th className="px-4 py-3 font-medium">Web</th>
              <th className="px-4 py-3 font-medium">Comentarios</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium">Dirección</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((b) => (
              <Fragment key={b.id}>
                <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)]/50">
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3">{formatRating(b.rating)}</td>
                  <td className="px-4 py-3">{b.user_ratings_total ?? "—"}</td>
                  <td className="px-4 py-3">
                    {hasWebsite(b) ? (
                      <a
                        href={b.website!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] underline"
                      >
                        Sí
                      </a>
                    ) : (
                      <span className="text-[var(--color-muted-foreground)]">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-[var(--color-primary)] underline text-left"
                      onClick={() =>
                        setExpandedId(expandedId === b.id ? null : b.id)
                      }
                    >
                      {b.reviews?.length
                        ? `Ver ${b.reviews.length} comentario(s)`
                        : "Sin comentarios"}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {b.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">{b.address ?? "—"}</td>
                  <td className="px-4 py-3">{b.category ?? "—"}</td>
                </tr>
                {expandedId === b.id && b.reviews?.length > 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="bg-[var(--color-muted)]/40 px-4 py-3 text-xs"
                    >
                      <ul className="space-y-2">
                        {b.reviews.map((r, i) => (
                          <li key={i}>
                            <strong>
                              {r.rating != null ? `${r.rating}★ ` : ""}
                              {r.author ?? "Anónimo"}
                            </strong>
                            {r.relative_time ? ` · ${r.relative_time}` : ""}
                            <p className="mt-0.5 text-[var(--color-foreground)]">
                              {r.text}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-muted-foreground)]">
          <span>
            {businesses.length} negocio(s) · página {safePage} de {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/** Minúsculas, sin tildes, espacios colapsados — clave consistente para nicho/zona. */
export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ");
}

export function normalizeNiche(niche: string): string {
  return normalizeText(niche);
}

export function normalizeZone(zone: string): string {
  return normalizeText(zone);
}

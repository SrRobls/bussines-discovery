import type { Business, PlaceReview } from "../types/business.js";

function escapeCsv(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatReviewsForCsv(reviews: PlaceReview[]): string {
  if (!reviews.length) return "";
  return reviews
    .map((r) => {
      const stars = r.rating != null ? `[${r.rating}★]` : "";
      const author = r.author ? `${r.author}: ` : "";
      const time = r.relative_time ? ` (${r.relative_time})` : "";
      return `${stars}${author}${r.text}${time}`.trim();
    })
    .join(" | ");
}

const HEADERS = [
  "id",
  "name",
  "rating",
  "user_ratings_total",
  "address",
  "phone",
  "website",
  "category",
  "latitude",
  "longitude",
  "niche",
  "searched_zone",
  "search_mode",
  "google_place_id",
  "reviews",
  "created_at",
] as const;

export function businessesToCsv(businesses: Business[]): string {
  const lines = [HEADERS.join(",")];

  for (const b of businesses) {
    const row: Record<(typeof HEADERS)[number], unknown> = {
      ...b,
      reviews: formatReviewsForCsv(b.reviews ?? []),
    };
    lines.push(HEADERS.map((h) => escapeCsv(row[h])).join(","));
  }

  return lines.join("\n");
}

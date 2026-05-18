import type { LatLng } from "../utils/geo.js";

export interface PlaceReview {
  author: string | null;
  rating: number | null;
  text: string;
  relative_time: string | null;
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

export interface BusinessInput {
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
}

export interface SearchRequestBody {
  niche?: string;
  zone?: string;
  polygon?: LatLng[];
  mode?: "text" | "map";
}

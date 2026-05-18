-- Ejecutar en Supabase SQL Editor
-- Evita duplicar el mismo lugar para el mismo nicho + zona

create unique index if not exists businesses_place_niche_zone_uidx
  on public.businesses (google_place_id, niche, searched_zone)
  where google_place_id is not null;

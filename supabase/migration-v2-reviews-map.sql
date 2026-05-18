-- Ejecutar en Supabase SQL Editor (proyecto ya existente)

alter table public.businesses
  add column if not exists google_place_id text,
  add column if not exists reviews jsonb not null default '[]'::jsonb,
  add column if not exists search_mode text not null default 'text';

create index if not exists businesses_google_place_id_idx
  on public.businesses (google_place_id);

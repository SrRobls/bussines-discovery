-- Ejecutar en el SQL Editor de Supabase

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating numeric,
  user_ratings_total integer,
  address text,
  phone text,
  website text,
  category text,
  latitude numeric,
  longitude numeric,
  niche text not null,
  searched_zone text not null,
  google_place_id text,
  reviews jsonb not null default '[]'::jsonb,
  search_mode text not null default 'text',
  created_at timestamptz not null default now()
);

create index if not exists businesses_created_at_idx
  on public.businesses (created_at desc);

create index if not exists businesses_niche_zone_idx
  on public.businesses (niche, searched_zone);

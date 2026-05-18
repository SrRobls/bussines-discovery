# Business Discovery MVP

MVP para validar búsqueda de negocios locales por **nicho + zona** usando Google Places API, guardando resultados en Supabase y exportando a CSV.

## Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, shadcn/ui (componentes base)
- **Backend:** Node.js, Express, TypeScript
- **DB:** Supabase (PostgreSQL)

## Estructura

```text
business-discovery-mvp/
├── frontend/          # React + Vite (puerto 5173)
├── backend/           # Express API (puerto 4000)
├── supabase/
│   └── schema.sql     # Tabla businesses
└── README.md
```

## Requisitos previos

1. Cuenta en [Supabase](https://supabase.com)
2. API key de [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service/text-search) con **Places API (New)** habilitada
3. Node.js 18+

## 1. Base de datos (Supabase)

En el **SQL Editor** de tu proyecto Supabase, ejecuta:

```bash
# Contenido del archivo:
supabase/schema.sql
```

Copia `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` desde: **Project Settings → API**.

> Usa la **service role key** solo en el backend, nunca en el frontend.

## 2. Backend

```bash
cd backend
cp .env.example .env
```

Edita `.env`:

```env
PORT=4000
GOOGLE_PLACES_API_KEY=tu_api_key
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Instalar y correr:

```bash
npm install
npm run dev
```

API en `http://localhost:4000`

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/businesses/search` | Busca en Google Places, guarda en Supabase |
| `GET` | `/api/businesses` | Lista negocios guardados |
| `GET` | `/api/businesses/export` | Descarga `businesses.csv` |
| `GET` | `/health` | Health check |

**Ejemplo búsqueda:**

```bash
curl -X POST http://localhost:4000/api/businesses/search \
  -H "Content-Type: application/json" \
  -d '{"niche":"odontología","zone":"Laureles Medellín"}'
```

## 3. Frontend

```bash
cd frontend
cp .env.example .env
```

`.env`:

```env
VITE_API_URL=http://localhost:4000
```

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

## Migración v2 (reseñas + mapa)

Si ya tenías la tabla creada, ejecuta en Supabase SQL Editor:

`supabase/migration-v2-reviews-map.sql`

## Límites de resultados

- Google Places **no devuelve todos** los negocios de una ciudad.
- Por búsqueda: hasta **60** resultados (paginación 20×3).
- Modo mapa: filtra por polígono dibujado dentro de ese límite.
- Las **reseñas** se obtienen vía Place Details (más llamadas API = más consumo del crédito).

## Flujo de uso

### Por texto
1. Nicho + zona → **Buscar**
2. Clic en **Ver comentarios** en la tabla
3. **Exportar CSV** incluye columna `reviews` con todos los comentarios

### Por mapa
1. Pestaña **Por mapa**
2. Clic en el mapa para marcar vértices (mín. 3)
3. Nicho opcional (vacío = negocios genéricos en el área)
4. **Buscar en zona dibujada**

## Criterios de aceptación

- [x] Frontend y backend corren localmente
- [x] Búsqueda por nicho + zona vía Google Places Text Search
- [x] Tabla con nombre, rating, reseñas, dirección, teléfono, website, categoría, coordenadas
- [x] Persistencia en Supabase
- [x] Export CSV (`businesses.csv`)
- [x] Sin secretos hardcodeados
- [x] README con setup

## Notas

- Cada búsqueda **inserta** nuevos registros (no deduplica por place_id en este MVP).
- Sin login, sin auth, sin Docker — a propósito para validar rápido.
- Costos de Google Places: el backend usa **FieldMask mínimo** para reducir facturación.

## Scripts de producción (opcional)

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm run preview
```
# bussines-discovery

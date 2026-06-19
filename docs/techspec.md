# Technical Specification

## Stack

| Component | Version / tool |
|-----------|----------------|
| Node.js | 22+ |
| Frontend | React 19, React Router 7, Vite 6, TypeScript 5.8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Icons / motion | Lucide React, Motion |
| Backend | Express 4, TypeScript, tsx (dev) |
| Database | Supabase (`@supabase/supabase-js` 2.x) |
| Containers | Docker Compose (nginx + Express) |

## Folder structure

```text
src/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Routes
│   │   ├── components/          # Layout + UI
│   │   ├── pages/               # Home, PetsList, PetDetail, Adopt
│   │   ├── services/api.ts      # HTTP client + ApiError
│   │   └── types.ts             # Frontend Pet type
│   ├── nginx/default.conf       # SPA + API reverse proxy (Mode A)
│   └── vite.config.ts           # Dev proxy to backend (Mode A)
└── backend/
    ├── src/
    │   ├── index.ts             # Express routes
    │   ├── env.ts               # Env validation
    │   ├── supabase.ts          # Admin client
    │   ├── mappers.ts           # snake_case → camelCase
    │   ├── errors.ts            # PostgREST error mapping
    │   └── types.ts             # Backend DTO types
    └── supabase/schema.sql      # Tables, RLS, seed
```

## Deployment modes

| Mode | Setup | CORS |
|------|-------|------|
| **A (default)** | Vite proxy (dev) or nginx (Docker) — browser calls `/api/*` same origin | Not required |
| **B** | Frontend and API on different hosts | `CORS_ORIGIN` required in production |

See [C4 § deployment](architecture/c4.md).

## Environment variables

| Variable | Required | Where | Purpose |
|----------|----------|-------|---------|
| `SUPABASE_URL` | Yes | Backend | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Backend | Admin DB access (server only) |
| `PORT` | No | Backend | API port (default `4000`) |
| `NODE_ENV` | No | Backend | `production` tightens CORS (Mode B) |
| `CORS_ORIGIN` | Mode B prod | Backend | Comma-separated allowed origins |
| `VITE_API_BASE_URL` | No | Frontend | API prefix (default `""`) |
| `VITE_API_PROXY_TARGET` | No | Frontend dev | Vite proxy target (default `http://localhost:4000`) |

Copy [`.env.example`](../.env.example) to `.env` at repo root for Docker; backend reads env from process.

## Database schema

Defined in [`src/backend/supabase/schema.sql`](../src/backend/supabase/schema.sql). Status rules: [state-machines.md](architecture/state-machines.md).

### `pets`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text PK | e.g. `buster` |
| `name`, `quote`, `description` | text | Display fields |
| `image_url` | text | Mapped to `imageUrl` in API |
| `age`, `breed` | text | |
| `likes`, `tags` | text[] | |
| `status` | text | `available`, `pending`, `adopted` |
| `ref_id` | text | Mapped to `refId` |
| `created_at`, `updated_at` | timestamptz | |

**RLS**: public SELECT; service role full access.

### `adoption_applications`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | Auto-generated |
| `pet_id` | text FK → pets | |
| `applicant_name`, `favorite_snack` | text | |
| `promise_given` | boolean | |
| `status` | text | `pending`, `approved`, `rejected` |
| `created_at` | timestamptz | |

**RLS (current)**: anon INSERT; service role read/update/delete. **Target v2**: BFF-only writes — see [ERD](architecture/erd.md).

**Seed**: 4 pets — `buster`, `luna`, `cloud`, `daisy`.

## Scripts

| Command | Location | Action |
|---------|----------|--------|
| `npm run dev` | repo root | Frontend dev server (:3000, Mode A) |
| `npm run dev:api` | repo root | Backend dev server (:4000) |
| `npm run lint` | frontend / backend | `tsc --noEmit` |
| `docker compose up --build` | repo root | nginx :8080 + API :4000 |

## Frontend routes

| Path | Page | SRS |
|------|------|-----|
| `/` | Home | PRD F1 |
| `/pets` | PetsList | FR-1.x |
| `/pet/:id` | PetDetail | FR-2.x |
| `/adopt/:id` | Adopt | FR-3.x (blocks if not `available`) |
| `*` | Redirect to `/` | — |

## UI constants

| Constant | Value | Source |
|----------|-------|--------|
| Filter tag pills | `Very Wiggly`, `Expert Napper`, `Gentle` | `PetsList.tsx` |
| Tag filter logic | OR among pills; AND with search | FR-1.5 |
| Home pet count copy | `4 Pups` | matches seed count |
| Adopt success redirect | 3s → `/pets` | `Adopt.tsx` |
| Adopt unavailable guard | Block message, no form | FR-3.6 |

## Backend hardening (current)

- JSON body limit: 1 MB
- Adoption POST: field validation, pet availability check (409), IP rate limit (10/min)
- Production CORS: denied unless `CORS_ORIGIN` set (Mode B)
- 500 errors: generic message; details logged server-side
- **Known v1 gap**: SELECT-then-INSERT race on adoption — documented in [TDD §4](TDD.md); v2 transaction

## Health endpoints

| Path | Status | Notes |
|------|--------|-------|
| `GET /health` | Implemented | Liveness (FR-4.1) |
| `GET /health/ready` | Implemented | Supabase ping — FR-4.2 |

## Related docs

**Pre-dev pack**: [README](README.md) (core 7 documents)

- [PRD](PRD.md) · [SRS](SRS.md) · [TDD](TDD.md)
- [C4](architecture/c4.md) · [ERD](architecture/erd.md) · [state-machines](architecture/state-machines.md)
- [OpenAPI](openapi.yaml) · [User flows](ux-ui-flows/user-flows.md)

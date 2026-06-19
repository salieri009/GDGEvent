# Doggie Doodles

[![Node.js 22+](https://img.shields.io/badge/node-22+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Browse adoptable dogs and submit an application. UI brand: **DoodlePaws**. Stack: React (Vite) → Express BFF → Supabase.

## Quick start

1. Copy `.env.example` → `.env` and set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Run `src/backend/supabase/schema.sql` in the Supabase SQL editor.
3. From repo root:

```bash
npm install --prefix src/backend && npm install --prefix src/frontend
npm run dev:api   # :4000
npm run dev       # :3000
```

Docker: `docker compose up --build` → web `:8080`, API `:4000`.

## API

| Method | Path |
|--------|------|
| GET | `/health`, `/health/ready` |
| GET | `/api/pets`, `/api/pets/:id` |
| POST | `/api/adoption-applications` |
| POST/GET | `/api/admin/login`, `/api/admin/applications`, review RPC (v2) |

Optional: `GET /api/pets?limit=&offset=&status=&tag=&q=`. v2: `v2-migration.sql` + `ADMIN_API_KEY`.

## Scripts (repo root)

```bash
npm run lint && npm run lint:api
npm test
npm run validate:openapi
```

## Layout

```text
src/frontend/   Vite + React (feature folders)
src/backend/    Express API + supabase/schema.sql
docs/           PRD, SRS, OpenAPI, architecture, UX flows
```

## Documentation

Index: [docs/README.md](docs/README.md) · OpenAPI: [docs/openapi.yaml](docs/openapi.yaml)

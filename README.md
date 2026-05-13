<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Doggie Doodles (Frontend + Backend)

React (Vite) frontend, Express backend (BFF), and Supabase (Postgres).

## Repository layout

```text
.
├── docker-compose.yml      # web (nginx) + api
├── src/
│   ├── frontend/           # Vite + React app
│   │   ├── src/            # UI source
│   │   ├── nginx/          # reverse proxy config (Docker)
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── backend/            # Express API
│       ├── src/
│       ├── supabase/       # SQL schema + seed
│       ├── Dockerfile
│       └── package.json
└── .env.example
```

## Architecture

- Browser → **frontend** (`/api/*` proxied to **backend** in dev/Docker)
- Backend → Supabase with **service role** key (keep off the client)

Endpoints:

- `GET /health`
- `GET /api/pets`
- `GET /api/pets/:id`
- `POST /api/adoption-applications`

## Run locally

**Prerequisites:** Node.js 22+ (or match Docker images)

### 1) Environment

From the repo root, copy `.env.example` to `.env` or `.env.local` and set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional for the Vite dev server:

- `VITE_API_PROXY_TARGET` (default `http://localhost:4000`)

### 2) Backend

```bash
cd src/backend
npm install
npm run dev
```

API listens on `http://localhost:4000`.

### 3) Frontend

In another terminal:

```bash
cd src/frontend
npm install
npm run dev
```

App is on `http://localhost:3000`. Vite proxies `/api` and `/health` to the backend.

### Shortcut scripts (repo root)

```bash
npm install --prefix src/frontend
npm install --prefix src/backend
npm run dev:api    # backend
npm run dev        # frontend
```

## Run with Docker

Create a `.env` in the repo root with real Supabase values, then:

```bash
docker compose up --build
```

- Web (static + `/api` proxy): `http://localhost:8080`
- API (direct): `http://localhost:4000`

## Database

Apply `src/backend/supabase/schema.sql` in the Supabase SQL editor to create tables, RLS policies, and seed pets.

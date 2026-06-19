# Architecture Overview (Quick Reference)

> **Full C4 model**: [c4.md](c4.md) · **Data**: [erd.md](erd.md) · **Status rules**: [state-machines.md](state-machines.md)

## One-line

Browser → React SPA → (proxy, Mode A) → Express BFF → Supabase Postgres

## Request flow

| Mode | Entry | API path | CORS |
|------|-------|----------|------|
| **A (default)** Dev | `localhost:3000` | Vite proxy → `:4000` | None |
| **A** Docker | `localhost:8080` | nginx → `api:4000` | None |
| **B** Split host | Frontend origin | Direct to API host | `CORS_ORIGIN` |

## Security

- `SUPABASE_SERVICE_ROLE_KEY` — backend only
- BFF is authoritative write path for adoption POST (NFR-2.6)
- Production CORS — only when Mode B (`CORS_ORIGIN`)

## Deploy

```bash
# Local (Mode A)
npm run dev:api   # :4000
npm run dev       # :3000

# Docker (Mode A)
docker compose up --build   # :8080 web, :4000 api
```

## Doc pack

See [docs/README.md](../README.md) for the core 7 documents, terminology, and v1 constants.

**Product name**: DoodlePaws (UI) · **Repo**: Doggie Doodles

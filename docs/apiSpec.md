# API Specification (Summary)

> **Canonical contract:** [openapi.yaml](openapi.yaml) — if this summary conflicts, **OpenAPI wins**.

**Base URL (direct):** `http://localhost:4000`  
**Frontend (Mode A):** same-origin `/api/*` via proxy — **no CORS**  
**Auth (v1):** None

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness — process up |
| GET | `/health/ready` | Readiness — DB reachable (Supabase ping) |
| GET | `/api/pets` | All pets, `created_at` asc; optional `?limit=1–100&offset=0` (v2 pagination) |
| GET | `/api/pets/{id}` | One pet; `{id}` = `[a-z0-9-]+` |
| POST | `/api/adoption-applications` | Submit application (rate limited) |

---

## Pet response (`Pet`)

**Required:** `id`, `name`, `status`  
**Optional/nullable:** `quote`, `description`, `imageUrl`, `age`, `breed`, `refId`  
**Arrays (default `[]`):** `likes`, `tags`  
**Status enum:** `available` | `pending` | `adopted`

Full schema: [openapi.yaml `#/components/schemas/Pet`](openapi.yaml).

---

## Adoption request / response

**Request (all required):**

```json
{
  "petId": "buster",
  "applicantName": "Jane Doe",
  "favoriteSnack": "Bacon",
  "promiseGiven": true
}
```

**Response `201`:** `{ "ok": true }` — no `applicationId` in v1.

---

## Errors

```json
{ "error": "message" }
```

| Status | When |
|--------|------|
| 400 | Invalid payload or invalid pet id |
| 404 | Pet not found |
| 409 | Pet not available for adoption |
| 429 | Rate limit (10/min/IP on POST) |
| 500 | Internal server error |
| 503 | Schema not migrated |

503 may include `hint`, `code`, `details`.

---

## CORS (see [C4 Mode A/B](architecture/c4.md))

| Deploy mode | CORS |
|-------------|------|
| Mode A — proxy (default) | Not used |
| Mode B — split API host | Set `CORS_ORIGIN` |

---

## Implementation

[`src/backend/src/index.ts`](../src/backend/src/index.ts)

## Related

[SRS](SRS.md) · [TDD](TDD.md) · [State machines](architecture/state-machines.md)

# SRS — Software Requirements Specification

**Product**: DoodlePaws v1.0  
**Derived from**: [PRD.md](PRD.md)  
**Audience**: Frontend, Backend, QA

---

## 1. System overview

**Architecture:** React SPA + Express BFF + Supabase Postgres (not classic 3-tier domain layering).  
**Auth:** None in v1. **API:** JSON over HTTP; contract in [openapi.yaml](openapi.yaml).

---

## 2. Functional requirements

### FR-1 Pet catalog

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-1.1 | System returns all pets | `GET /api/pets` → `Pet[]`, ordered by `created_at` ascending |
| FR-1.2 | System returns a single pet by id | `GET /api/pets/:id` → `Pet` or 404 |
| FR-1.3 | UI displays list as a grid | Image, name, breed, description summary |
| FR-1.4 | UI filters by search on name/tags | Case-insensitive substring; AND with tag filter |
| FR-1.5 | UI filters by tag pills | **OR** among selected pills; pet must match ≥1 selected tag |
| FR-1.6 | List shows pets of all statuses | No server-side status filter in v1; badges show `available` / `pending` / `adopted` |

### FR-2 Pet detail

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-2.1 | Detail page shows status badge | Maps to [state-machines](architecture/state-machines.md) |
| FR-2.2 | Shows description, quote, likes, refId | Mapped from API fields |
| FR-2.3 | Adopt CTA only when `available` | Hidden for `pending` / `adopted` |

### FR-3 Adoption application

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-3.1 | User submits an application | POST `/api/adoption-applications` |
| FR-3.2 | Required: petId, applicantName, favoriteSnack, promiseGiven=true | 400 if missing/invalid |
| FR-3.3 | Insert only when pet is `available` | 409 otherwise |
| FR-3.4 | Success screen then redirect to `/pets` after 3s | Client navigate |
| FR-3.5 | Rate limit 10 POST requests per IP per minute | 429 when exceeded |
| FR-3.6 | Adopt page blocks unavailable pets | If pet not `available`, show message; no submit form (align FR-2.3) |

### FR-4 Platform

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-4.1 | Liveness endpoint | `GET /health` → `{ "ok": true }` (process up) |
| FR-4.2 | Readiness endpoint | `GET /health/ready` → `{ "ok": true }` only if Supabase reachable |
| FR-4.3 | Docker healthcheck | Uses FR-4.1 on api service |
| FR-4.4 | Schema not migrated | 503 + hint on PostgREST schema errors |

### FR-5 Admin (v2)

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-5.1 | Operator logs in with API key | POST `/api/admin/login`; key stored client-side as `X-Admin-Key` |
| FR-5.2 | List pending applications | GET `/api/admin/applications?status=pending` |
| FR-5.3 | Approve application | POST review `{ action: "approve" }` → app `approved`, pet `adopted` (RPC) |
| FR-5.4 | Reject application | POST review `{ action: "reject" }` → app `rejected`, pet `available` (RPC) |
| FR-5.5 | Server-side pet filters | GET `/api/pets?status=&tag=&q=` |

---

## 3. Non-functional requirements

### NFR-1 Performance

| ID | Requirement | Target | Assumption |
|----|-------------|--------|------------|
| NFR-1.1 | Pet list API (local, warm) | p95 < 500ms | ≤100 pets, seq scan |
| NFR-1.2 | SPA first paint (local) | < 3s | Manual Lighthouse |
| NFR-1.3 | JSON body limit | 1 MB | Express |
| NFR-1.4 | Catalog scale ceiling | Client filter valid ≤100 pets | Optional `?limit`/`?offset` on `GET /api/pets` (v1.1 implemented); UI still loads full catalog in v1 |

### NFR-2 Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-2.1 | Service role key server-only | Backend env only |
| NFR-2.2 | CORS | Mode A (proxy): not required. Mode B (split host): `CORS_ORIGIN` required — see [C4](architecture/c4.md) |
| NFR-2.3 | 500 error sanitization | Generic client message |
| NFR-2.4 | Input validation | trim, max 200 chars, petId regex |
| NFR-2.5 | Rate limiting | In-memory 10/min/IP on adoption POST only |
| NFR-2.6 | Write path | BFF authoritative; RLS anon INSERT is known gap — [ERD](architecture/erd.md) |

### NFR-3 Reliability

| ID | Requirement | Note |
|----|-------------|------|
| NFR-3.1 | Depends on Supabase availability | Single region |
| NFR-3.2 | Fetch failure UX | Error + retry on all read pages |

### NFR-4 Maintainability

| ID | Requirement | Note |
|----|-------------|------|
| NFR-4.1 | TypeScript compile | `npm run lint` |
| NFR-4.2 | API contract | [openapi.yaml](openapi.yaml) canonical |
| NFR-4.3 | Schema source | [schema.sql](../src/backend/supabase/schema.sql) |

### NFR-5 Scalability (v1 limits)

| ID | Limitation | Mitigation |
|----|------------|------------|
| NFR-5.1 | Rate limit in-memory per instance | Max 1 API replica OR Redis v2 |
| NFR-5.2 | Adoption POST not serializable | Documented TOCTOU — [state-machines](architecture/state-machines.md) |
| NFR-5.3 | GET endpoints unrate-limited | Accept demo risk; WAF v2 |

---

## 4. Constraints

| Type | Constraint |
|------|------------|
| **Stack** | React 19, Vite 6, Express 4, Supabase, Node 22+ |
| **Auth** | None in v1 |
| **Locale** | English UI only |
| **Deploy default** | Mode A same-origin proxy |

---

## 5. Data requirements

- Tables: `pets`, `adoption_applications` — [ERD](architecture/erd.md)
- Seed: 4 pets minimum
- Application insert: `status = pending`; pet status unchanged in **legacy v1 fallback**; v2 RPC sets pet → `pending` — [state-machines](architecture/state-machines.md)

---

## 6. Interface requirements

| Interface | Spec |
|-----------|------|
| REST API | [openapi.yaml](openapi.yaml) |
| Error format | `{ "error": string }` (+ optional fields on 503) |
| Auth | None (v1) |

---

## 7. Traceability (PRD → SRS)

| PRD | SRS |
|-----|-----|
| F1 Home | FR-1.3, UC-1 |
| F2 List | FR-1.1, FR-1.3, FR-1.6 |
| F3 Search/filter | FR-1.4, FR-1.5 |
| F4 Detail | FR-2.x |
| F5 Application | FR-3.1–FR-3.3, FR-3.5, FR-3.6 |
| F6 Success | FR-3.4 |
| S3 Operator | FR-4.x, NFR-4.x |

---

## 8. Open items

| ID | Question | v1 default |
|----|----------|------------|
| OQ1 | Auto-set pet → pending on application? | **Legacy:** No. **With v2 RPC:** Yes — [state-machines](architecture/state-machines.md), [ERD § v2 migration](architecture/erd.md) |
| OQ2 | Allow duplicate applications? | Yes |
| OQ3 | Production deploy Mode A or B? | Mode A for Docker demo |
| OQ4 | Rate limit across replicas? | Single instance or accept drift |
| OQ5 | Revoke anon INSERT on applications? | v2 migration |

---

## 9. Related documents

- [PRD](PRD.md) · [State machines](architecture/state-machines.md) · [C4](architecture/c4.md)
- [TDD](TDD.md) · [User flows](ux-ui-flows/user-flows.md) · [OpenAPI](openapi.yaml)

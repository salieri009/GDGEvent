# TDD — Technical Design Document

**Product**: DoodlePaws v1.0  
**Refs**: [SRS](SRS.md) · [C4](architecture/c4.md) · [State machines](architecture/state-machines.md) · [OpenAPI](openapi.yaml)

---

## 1. Design principles

| Principle | Decision |
|-----------|----------|
| BFF as write gate | Browser never holds service role; validation on server |
| Contract-first | OpenAPI canonical; mapper produces DTOs |
| Fail visible | Reads: loading → error+retry or success |
| Explicit v1 limits | TOCTOU, RLS gap, client-side filter — documented not hidden |

---

## 2. Pet catalog (FR-1)

### Sequence

```mermaid
sequenceDiagram
  participant P as PetsList
  participant A as api.ts
  participant B as Express
  participant S as Supabase
  P->>A: getAll()
  A->>B: GET /api/pets
  B->>S: select * order created_at
  S-->>B: rows
  B->>B: mapPetRow
  B-->>A: Pet[]
  A-->>P: setPets / setLoading false
```

### Client filter logic (FR-1.4, FR-1.5)

```
matchesSearch = name or tags contains search (case insensitive)
matchesTags = no pills OR pet.tags intersects activePills (OR semantics)
visible = matchesSearch AND matchesTags
```

**Scale:** Valid for ≤100 pets (NFR-1.4). v2: `GET /api/pets?tag=&q=&status=`.

### Tag pills

Hardcoded: `Very Wiggly`, `Expert Napper`, `Gentle` — subset of seed tags ([ERD](architecture/erd.md)).

---

## 3. Pet detail (FR-2)

| HTTP | Client |
|------|--------|
| 200 | `Pet` |
| 404 | `undefined` → "Pup not found!" |
| other | error UI + retry |

**CTA:** render adopt block only if `pet.status === 'available'` ([state-machines](architecture/state-machines.md)).

---

## 4. Adoption submit (FR-3)

### Sequence

```mermaid
sequenceDiagram
  participant F as Adopt page
  participant B as Express
  participant S as Supabase
  F->>B: POST /api/adoption-applications
  B->>B: rateLimit
  B->>B: validateAdoptionPayload
  B->>S: SELECT pet status BY id
  alt not available
    B-->>F: 409
  else available
    B->>S: INSERT application pending
    B-->>F: 201 ok true
  end
```

### Concurrency (NFR-5.2)

**v1:** Two round trips without transaction — concurrent POSTs can both pass availability check.

**v2 target:**

```sql
-- sketch: single RPC
BEGIN;
SELECT status FROM pets WHERE id = $1 FOR UPDATE;
-- if available → insert application; optional update pet pending
COMMIT;
```

### Adopt page guard (FR-3.6)

On load, if `pet.status !== 'available'`: show blocking message (same as detail CTA hidden); do not render submit form.

### Validation

| Field | Rule |
|-------|------|
| `petId` | `/^[a-z0-9-]+$/`, trim |
| `applicantName`, `favoriteSnack` | non-empty, max 200 |
| `promiseGiven` | `true` |

### Rate limit

In-memory Map, 10/min/IP on POST only. **Deploy:** single API replica for demo or accept uneven limits (OQ4).

---

## 5. Health endpoints (FR-4)

| Endpoint | v1 | Checks |
|----------|-----|--------|
| `GET /health` | Implemented | Express process |
| `GET /health/ready` | Implemented | Supabase ping (operator UC-5) |

Operator flow: `GET /health` (liveness) then `GET /health/ready` (DB) before smoke-testing `/api/pets`.

---

## 6. Error handling

| Layer | Rule |
|-------|------|
| Backend | PGRST116→404; schema→503; other→500 generic |
| Frontend | `ApiError.status`; always `setLoading(false)` in `finally` |
| Submit errors | Parse JSON `error` field when possible (v1.1) |

---

## 7. State management

Page-local `useState` only — no global store v1.

| Page | Key state |
|------|-----------|
| PetsList | pets, search, activeTags, loading, error |
| PetDetail | pet, loading, error |
| Adopt | pet, form, submitting, loadError, submitError, submitted |

---

## 8. Security

| Concern | Implementation |
|---------|----------------|
| Secrets | No keys in Vite bundle |
| CORS | Mode A default — see [C4](architecture/c4.md) |
| RLS gap | Documented; v2 revoke anon INSERT |

---

## 9. File map

| Concern | Path |
|---------|------|
| Routes | `src/backend/src/index.ts` |
| Errors | `src/backend/src/errors.ts` |
| HTTP client | `src/frontend/src/services/api.ts` |
| Pages | `src/frontend/src/pages/*.tsx` |

---

## Related

- [User flows](ux-ui-flows/user-flows.md) · [ERD](architecture/erd.md)

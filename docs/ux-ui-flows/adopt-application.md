# UX Flow: Adoption Application

**SRS:** FR-3.x · **Parent:** [user-flows.md](user-flows.md)

---

## Entry

PetDetail → **Apply to Adopt** (`/adopt/:id`) when `status === available`.

Direct URL to `/adopt/:id` allowed; page enforces FR-3.6.

---

## Adopt page states

| State | UI |
|-------|-----|
| Loading | "Printing papers..." |
| Load error | Retry |
| Pet not found | "Which dog was it again?" |
| **Pet not available** | Block message + status; **no form** |
| Form | Name, snack, vow checkbox |
| Submitting | "Sending..." |
| Submit error | Red banner (400/409/429) |
| Success | "Wag-tastic!" → redirect `/pets` in 3s |

---

## Form fields

| Field | Validation |
|-------|------------|
| Legal name | required; max 200 server |
| Favorite snack | required; max 200 server |
| Sacred vow | checkbox required → `promiseGiven: true` |

---

## API

| Step | Method | Path |
|------|--------|------|
| Load | GET | `/api/pets/:id` |
| Submit | POST | `/api/adoption-applications` |

POST body: see [openapi.yaml](../openapi.yaml).

### v2 backend effect

When [`v2-migration.sql`](../../src/backend/supabase/v2-migration.sql) is applied, successful POST also sets pet → `pending`. UI copy unchanged; list/detail badges reflect new status on next fetch.

---

## Related

[user-flows.md](user-flows.md) · [TDD §4](../TDD.md) · [state-machines.md](../architecture/state-machines.md)

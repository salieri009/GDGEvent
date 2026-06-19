# UX Flow: Browse Pets

**SRS:** FR-1.x, FR-2.x · **Parent:** [user-flows.md](user-flows.md)

---

## Entry points

- Home → **Browse Pets** (`/pets`)
- Header → **Adopt a Dog** (`/pets`)

---

## PetsList (`/pets`)

| State | Behavior |
|-------|----------|
| Loading | "Fetching the pack..." |
| Error | Red message + **Try Again** → `GET /api/pets` |
| Success | Grid of all pets (all statuses per FR-1.6) |
| Empty filter | Zero cards, no dedicated empty copy (v1) |

### Filter rules (FR-1.4, FR-1.5)

- **Search:** matches `name` OR any `tag` (substring, case insensitive)
- **Tag pills:** `Very Wiggly`, `Expert Napper`, `Gentle`
- **Combined:** `matchesSearch AND matchesTags`
- **Among pills:** **OR** — pet needs ≥1 selected tag
- **Among pills + search:** AND

---

## PetDetail (`/pet/:id`)

| State | Behavior |
|-------|----------|
| Loading | "Studying the records..." |
| Error | Retry |
| 404 | "Pup not found!" |
| Success | Badge from `pet.status`; CTA only if `available` |

---

## API

| Step | Method | Path |
|------|--------|------|
| List | GET | `/api/pets` |
| Detail | GET | `/api/pets/:id` |

---

## Related

[user-flows.md](user-flows.md) · [state-machines.md](../architecture/state-machines.md) · [ux-ui-rules.md](ux-ui-rules.md)

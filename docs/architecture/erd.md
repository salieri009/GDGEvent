# DB Schema & ERD

**DB**: Supabase Postgres · **Schema file**: [`src/backend/supabase/schema.sql`](../../src/backend/supabase/schema.sql)

---

## ERD

```mermaid
erDiagram
  pets ||--o{ adoption_applications : "has"

  pets {
    text id PK
    text name NN
    text status "available|pending|adopted"
    text_array tags
    timestamptz created_at
  }

  adoption_applications {
    uuid id PK
    text pet_id FK
    text applicant_name NN
    boolean promise_given NN
    text status "pending|approved|rejected"
    timestamptz created_at
  }
```

**Cardinality**: 1 pet → N applications (ON DELETE CASCADE)

---

## Tables

### `pets`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | text | PK |
| `name` | text | NOT NULL |
| `quote`, `description`, `image_url`, `age`, `breed`, `ref_id` | text | nullable |
| `likes`, `tags` | text[] | default `{}` |
| `status` | text | NOT NULL, CHECK, default `available` |
| `created_at`, `updated_at` | timestamptz | NOT NULL, default now() |

### `adoption_applications`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, default gen_random_uuid() |
| `pet_id` | text | FK → pets(id), NOT NULL, ON DELETE CASCADE |
| `applicant_name` | text | NOT NULL |
| `favorite_snack` | text | nullable in DB; **required by API** (BFF validation) |
| `promise_given` | boolean | NOT NULL, default false |
| `status` | text | NOT NULL, CHECK, default `pending` |
| `created_at` | timestamptz | NOT NULL, default now() |

---

## Normalization

| Decision | Rationale |
|----------|-----------|
| **Pragmatic denormalization** | Pet attributes in one row; `likes[]`, `tags[]` as Postgres arrays (not 3NF for tags) |
| **No user table** | v1 anonymous applications |
| **`age` / `breed` as text** | Display strings only; not queryable dates |

**v2**: Normalize `tags` → lookup table; optional `date_of_birth` column.

---

## RLS — current schema vs target

### Current (v1 `schema.sql`)

| Table | anon / authenticated | service_role |
|-------|---------------------|--------------|
| `pets` | SELECT | ALL |
| `adoption_applications` | **INSERT** | SELECT, UPDATE, DELETE |

**Risk:** Direct PostgREST access with anon key can INSERT applications **without BFF validation**. v1 SPA does not use anon key; risk is credential leakage or future client changes.

### Target (v2 hardening)

| Table | anon | service_role / BFF |
|-------|------|---------------------|
| `pets` | SELECT only | ALL |
| `adoption_applications` | **no public write** | INSERT/UPDATE via BFF only |

Until migration: treat BFF as **authoritative write path**; rotate anon key if exposed.

---

## Referential integrity

| Rule | Behavior |
|------|----------|
| `adoption_applications.pet_id` → `pets.id` | FK, ON DELETE **CASCADE** |
| Cascade impact | Deleting a pet **deletes all its applications** — acceptable for demo seed resets; **avoid in production** (v2: RESTRICT or soft-delete pets) |

---

## Index strategy

| Index | Column(s) | Purpose | v1 |
|-------|-----------|---------|-----|
| PK | `pets.id` | Lookup by slug | ✅ implicit |
| PK | `adoption_applications.id` | — | ✅ implicit |
| FK | `adoption_applications.pet_id` | Join / filter by pet | ✅ implicit |
| — | `pets.created_at` | List ordering | Seq scan OK (4 rows) |
| — | `pets.status` | Filter available | **Optional** if catalog > 100 |
| — | `(pet_id, applicant_name)` UNIQUE | Dedupe applications | **Not in v1** (OQ2) |

**Recommendation**: Add `CREATE INDEX idx_pets_status ON pets(status)` when catalog exceeds ~50 rows.

---

## API ↔ DB mapping

| API (camelCase) | DB (snake_case) |
|-----------------|-----------------|
| `imageUrl` | `image_url` |
| `refId` | `ref_id` |
| `petId` | `pet_id` |
| `applicantName` | `applicant_name` |
| `favoriteSnack` | `favorite_snack` |
| `promiseGiven` | `promise_given` |

Mapper: [`mappers.ts`](../../src/backend/src/mappers.ts)

---

## Seed

| id | name | status | tags (sample) |
|----|------|--------|---------------|
| buster | Buster | available | Very Wiggly, Big Ears |
| luna | Luna | available | Expert Napper, Small |
| cloud | Cloud | available | Chaos, Fluffy |
| daisy | Daisy | available | Gentle, Sweet Soul |

**Filter pills** (UI): `Very Wiggly`, `Expert Napper`, `Gentle` — defined in `PetsList.tsx`; must stay in sync with seed `tags` above.

---

## v1 known gaps (by design)

1. No automatic `pets.status` change after application submit  
2. No unique constraint on duplicate applications for the same pet  
3. No `adoption_applications.updated_at` column  

---

## Related

- [State machines](state-machines.md) · [C4](c4.md) · [OpenAPI](../openapi.yaml) · [SRS](../SRS.md) · [TDD](../TDD.md)

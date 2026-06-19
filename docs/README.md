# DoodlePaws — Pre-Development Doc Pack

> **Purpose**: Align the team on the same picture **before coding** — core 7 documents + minimum 4-document set.

## Terminology (use consistently)

| Term | Meaning |
|------|---------|
| **DoodlePaws** | Product / UI brand name (header, docs) |
| **Doggie Doodles** | Repository name ([README](../README.md) title) |
| **BFF** | Express backend; sole holder of Supabase service role key |
| **Pet** | Catalog record (`pets` table / `Pet` JSON type) |
| **Adoption application** | User submission (`adoption_applications` table) |
| **Available** | `pets.status === 'available'` — required to show adopt CTA and accept POST |
| **Mode A** | Same-origin proxy (Vite dev / nginx Docker) — default deploy |
| **Mode B** | Split frontend/API hosts — requires `CORS_ORIGIN` |

## Document hierarchy & sync rules

```
PRD (scope)
  └─ SRS (FR/NFR IDs)
       ├─ C4 + ERD + state-machines (structure, data, status rules)
       ├─ openapi.yaml (API contract — canonical)
       │    └─ apiSpec.md (human summary, must match OpenAPI)
       ├─ user-flows.md (journeys; screen detail in browse/adopt)
       └─ TDD (implementation; references FR IDs)
            └─ techspec.md (env, scripts, stack reference)
```

**When changing behavior**: update code → `openapi.yaml` → `apiSpec.md` → SRS (if FR/NFR) → TDD → affected UX docs → `state-machines.md` if status rules change.

## Core 7 (required before development starts)

| # | Document | One line | File |
|---|----------|----------|------|
| 1 | **PRD** | What we are building | [PRD.md](PRD.md) |
| 2 | **SRS** | Features and conditions (developer detail) | [SRS.md](SRS.md) |
| 3 | **Architecture (C4)** | Overall system structure | [architecture/c4.md](architecture/c4.md) |
| 4 | **API Spec** | Frontend ↔ backend contract | [openapi.yaml](openapi.yaml) · [apiSpec.md](apiSpec.md) |
| 5 | **DB / ERD** | Confirmed data structure | [architecture/erd.md](architecture/erd.md) |
| 6 | **User Flow / Use Case** | User journeys | [ux-ui-flows/user-flows.md](ux-ui-flows/user-flows.md) |
| 7 | **TDD** | Implementation design for core features | [TDD.md](TDD.md) |

## Minimum 4 (when time is limited)

1. [PRD.md](PRD.md)
2. [architecture/c4.md](architecture/c4.md) (C4 L1–L2)
3. [openapi.yaml](openapi.yaml)
4. [architecture/erd.md](architecture/erd.md)

## Supporting documents

| Doc | Purpose |
|-----|---------|
| [architecture/state-machines.md](architecture/state-machines.md) | Pet/application status rules (v1 vs v2) |
| [architecture/overview.md](architecture/overview.md) | Deploy and request flow summary |
| [techspec.md](techspec.md) | Stack, env, scripts reference |
| [ux-ui-flows/browse-pets.md](ux-ui-flows/browse-pets.md) | Browse/detail screen detail |
| [ux-ui-flows/adopt-application.md](ux-ui-flows/adopt-application.md) | Adoption screen detail |
| [ux-ui-flows/ux-ui-rules.md](ux-ui-flows/ux-ui-rules.md) | UI design tokens |
| [dev-readiness-review.md](dev-readiness-review.md) | Alignment audit record |
| [roadmap-loop-plan.md](roadmap-loop-plan.md) | 10-loop doc sync checklist (complete) |

## Recommended reading order

```
PRD → SRS → C4 → ERD → state-machines → OpenAPI → User Flow → TDD → code
```

## v1 constants (must match across docs & code)

| Constant | Value |
|----------|-------|
| Health endpoints | `/health` (liveness), `/health/ready` (DB readiness) |
| API endpoints | `/api/pets`, `/api/pets/:id`, POST `/api/adoption-applications` |
| Seed pets | `buster`, `luna`, `cloud`, `daisy` (4 total) |
| Pet statuses | `available`, `pending`, `adopted` |
| Application statuses | `pending`, `approved`, `rejected` |
| v1 status workflow | **Legacy fallback** (no v2 RPC): submit does **not** change `pets.status`. With `v2-migration.sql` RPC deployed, submit sets pet → `pending` — see [state-machines](architecture/state-machines.md) |
| Rate limit | 10 POST / IP / minute |
| Filter tag pills | `Very Wiggly`, `Expert Napper`, `Gentle` |
| Filter semantics | OR among pills; AND with search |
| Deploy default | **Mode A** (same-origin proxy, no CORS) |
| Redirect after adopt success | 3 seconds → `/pets` |
| Frontend layout | Feature folders: `app/`, `features/`, `shared/`, `components/layout/` — see [techspec](techspec.md) |

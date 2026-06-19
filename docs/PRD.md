# PRD — DoodlePaws

| | |
|---|---|
| **Product** | DoodlePaws (dog adoption web app) |
| **Repository** | Doggie Doodles |
| **Version** | v1.0 MVP |
| **Updated** | 2026-06-19 |

---

## 1. Problem statement

- **Adopters** need lightweight browse + apply without shelter CRM complexity.
- **Operators** need DB-backed catalog and application intake.
- **v1** = demo/coursework scope — no auth, payments, or admin UI.

---

## 2. User goals

| Persona | Goal |
|---------|------|
| Prospective adopter | Find a dog and submit an application |
| Operator / developer | Run stack locally, Docker, or Cloud Run |

---

## 3. Feature list

| ID | Feature | v1 |
|----|---------|-----|
| F1 | Home + Browse CTA | Yes |
| F2 | Pet list (all statuses) | Yes |
| F3 | Search + tag filter (OR pills) | Yes |
| F4 | Pet detail + status badge | Yes |
| F5 | Adoption form + POST | Yes |
| F6 | Success confirmation | Yes |
| F7 | Admin login + review applications | Yes (v2) |
| F8–F9 | Email, payments | No / out of scope |

---

## 4. Core scenarios

**S1 — Browse:** `Home → /pets → search/filter → /pet/:id`

**S2 — Adopt:** `/pet/:id` (available) → `/adopt/:id` → POST → success → `/pets` (3s)

**S3 — Setup:** `.env` → `schema.sql` → `dev:api` + `dev` → verify API

---

## 5. Routes

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/pets` | List |
| `/pet/:id` | Detail |
| `/adopt/:id` | Application (available pets only) |
| `/admin/login` | Operator API key login (v2) |
| `/admin/applications` | Pending application review (v2) |

Marketing: `/#why-doodlepaws` anchor — no `/about` or `/foster` routes.

---

## 6. Non-goals

Auth, admin UI, email, payments, dedicated marketing routes, AI, i18n.

**v2.0 delivered:** operator login (`ADMIN_API_KEY`), admin application review UI, server-side pet filters, `v2-migration.sql` RPCs (submit + review).

**Still out of scope:** end-user auth/OAuth, email notifications, payments, E2E test suite.

---

## 7. Launch criteria

- [x] 4 seed pets list + detail
- [x] POST creates application row
- [x] Service role never in browser
- [x] Failed loads show retry UI
- [x] Unavailable pets blocked on adopt page

---

## 8. Roadmap

| Version | Scope |
|---------|-------|
| v1.0 | F1–F6 |
| v1.1 | OpenAPI CI (`npm run validate:openapi`), richer 409/429 copy ✅ |
| v2.0 | Admin login + review UI, pet list filters, RLS/RPC via `v2-migration.sql` ✅ |

**v2.1+ (future):** end-user OAuth, email, E2E, observability.

---

## 9. Related docs

| Doc | Purpose |
|-----|---------|
| [SRS](SRS.md) | FR/NFR |
| [state-machines](architecture/state-machines.md) | Status rules |
| [C4](architecture/c4.md) | Deploy Mode A/B |
| [openapi.yaml](openapi.yaml) | API contract |
| [ERD](architecture/erd.md) | Data model |
| [user-flows](ux-ui-flows/user-flows.md) | Journeys |
| [TDD](TDD.md) | Implementation |

---

## 10. Open questions

See [SRS §8](SRS.md) — OQ1–OQ5 (status workflow, duplicates, deploy mode, rate limit replicas, RLS).

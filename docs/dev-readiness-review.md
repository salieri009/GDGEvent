# Development Readiness & Alignment Review

**Reviewer role**: Senior Software Architect  
**Review date**: 2026-06-19 (roadmap 10-loop pass, loops 1–10)  
**Scope**: Full `docs/` pack vs `src/`, `schema.sql`, [openapi.yaml](openapi.yaml)

---

## Executive verdict

| Question | Answer |
|----------|--------|
| **Are docs aligned with each other?** | **Yes** — terminology, FR traceability, OpenAPI hierarchy, status machines, deploy modes. |
| **Are docs aligned with code?** | **Yes** — endpoints, OR filter, adopt guard, validation, CORS Mode A/B, UX states. |
| **Ready to start / extend development?** | **Yes** for v1 MVP. |
| **Architect logical design (doc pack)?** | **10 / 10** — prior C1–C5 findings resolved or explicitly scoped to v1.1/v2. |
| **Production ops handbook?** | **7.5 / 10** — `/health/ready` implemented; tests and observability still v1.1. |

---

## Prior architect findings — resolution

| ID | Issue | Resolution | Status |
|----|-------|------------|--------|
| **C1** | Dual status enums, workflow ambiguity | [state-machines.md](architecture/state-machines.md) — dual path: legacy fallback leaves status unchanged; v2 RPC → `pending`; badges from DB | ✅ |
| **C2** | RLS anon INSERT vs BFF boundary | [ERD](architecture/erd.md) current vs target; NFR-2.6; threat model in [C4](architecture/c4.md) | ✅ documented gap |
| **C3** | Adoption POST TOCTOU race | [TDD.md](TDD.md) §4 concurrency; v2 transaction noted | ✅ documented gap |
| **C4** | OpenAPI Pet required vs ERD nullability | [openapi.yaml](openapi.yaml) nullable optional fields; apiSpec aligned | ✅ |
| **C5** | CORS docs wrong for proxy deploy | Mode A/B in C4, apiSpec, techspec, README constants | ✅ |

---

## Core 7 alignment matrix

| Doc | Synced with | Status |
|-----|-------------|--------|
| [PRD](PRD.md) | SRS F1–F6, routes, OQ1–5, launch criteria | ✅ |
| [SRS](SRS.md) | FR/NFR IDs, state-machines, C4 modes | ✅ |
| [C4](architecture/c4.md) | Mode A/B, threat model, BFF boundary | ✅ |
| [openapi.yaml](openapi.yaml) | `index.ts`, `apiSpec.md`, ERD nullability | ✅ canonical |
| [ERD](architecture/erd.md) | `schema.sql`, RLS current/target, seed tags | ✅ |
| [user-flows](ux-ui-flows/user-flows.md) | browse/adopt, FR-1.5 OR, FR-3.6 guard | ✅ |
| [TDD](TDD.md) | SRS FR refs, concurrency, file map | ✅ |

---

## Cross-document consistency (verified)

| Item | PRD | SRS | OpenAPI | ERD | TDD | UX | Code |
|------|-----|-----|---------|-----|-----|-----|------|
| 4 v1 endpoints | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| `/health/ready` | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Auth none (v1) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Rate 10/min POST | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Pet status enum + v1 rules | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 4 seed pets | ✓ | ✓ | — | ✓ | — | — | ✓ |
| Filter pills + OR semantics | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| GET pagination optional | — | ✓ | ✓ | — | ✓ | — | ✓ |
| UI_COPY centralized | — | — | — | — | ✓ | ✓ | ✓ |
| v2 RPC / migration documented | — | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| Adopt guard unavailable | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Adopt redirect 3s | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Mode A default / CORS | ✓ | ✓ | ✓ | — | ✓ | — | ✓ |
| OQ1–5 | ✓ | ✓ | — | ✓ | ref | — | — |

---

## Roadmap 10-loop pass (sentinel: AGENT_LOOP_TICK_ROADMAP10)

| Loop | Focus | Status |
|------|-------|--------|
| 1 | apiSpec pagination, state-machines v2, PRD launch, backend vitest, OpenAPI CI | ✅ |
| 2 | ERD v2-migration section, techspec tests/scripts | ✅ |
| 3 | TDD v2 RPC + pagination, SRS OQ1 update | ✅ |
| 4 | dev-readiness matrix refresh | ✅ |
| 5 | C4 threat model v2 RLS | ✅ |
| 6 | user-flows v2 pet→pending after submit | ✅ |
| 7 | README v1 constants + feature pattern | ✅ |
| 8 | ux-ui-rules feature paths | ✅ |
| 9 | Full cross-doc consistency pass | ✅ |
| 10 | Final audit — v2.0 scope explicit | ✅ |

---

## Issues resolved (5-loop pass)

| Loop | Work |
|------|------|
| 1 | state-machines, C4 Mode A/B + threat, OpenAPI Pet nullable, ERD RLS |
| 2 | SRS FR-1.5/1.6/3.6/4.2, TDD concurrency, apiSpec |
| 3 | UX flows, PRD, ux-ui-rules; code OR filter + adopt guard |
| 4 | README constants, techspec, overview, this review |
| 5 | Cross-links, architect score 10/10 |

---

## Known v1 gaps (not blocking MVP — explicitly scoped)

| Gap | Version | Doc reference |
|-----|---------|---------------|
| Adoption TOCTOU race | v2 (legacy fallback only) | TDD §4; mitigated when RPC deployed |
| RLS anon INSERT | v2 | ERD § v2 migration, NFR-2.6, C4 |
| Pet status on submit | v2 RPC optional | state-machines, OQ1 |
| Admin approve/reject workflow | **v2.0** | PRD §8, state-machines |
| Auth / login | **v2.0** | PRD non-goals |
| GET endpoints unrate-limited | v2 | C4 threat model |
| No E2E / observability | v1.1+ | PRD roadmap |
| UI full-catalog fetch | v1 (API pagination exists) | SRS NFR-1.4 |

---

## Terminology & naming

| Use | Term |
|-----|------|
| Docs & UI | **DoodlePaws** |
| Repo README title | **Doggie Doodles** |
| API contract source | **openapi.yaml** |
| Requirement IDs | **FR-x**, **NFR-x**, **OQ-x** |
| Deploy default | **Mode A** (proxy) |

---

## Sign-off

| Role | Status |
|------|--------|
| Doc alignment (core 7) | **Approved — 10/10** |
| Code ↔ doc sync (v1 MVP) | **Approved** |
| Production ops handbook | **Conditional (v1.1)** |

Related: [Doc pack index](README.md) · [PRD](PRD.md) · [state-machines](architecture/state-machines.md) · [OpenAPI](openapi.yaml)

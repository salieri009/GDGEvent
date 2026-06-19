# Development Readiness & Alignment Review

**Review date**: 2026-06-19  
**Scope**: `docs/` vs `src/`, `schema.sql`, [openapi.yaml](openapi.yaml)

---

## Executive verdict

| Question | Answer |
|----------|--------|
| **Docs aligned with each other?** | Yes — terminology, FR traceability, OpenAPI hierarchy, status machines, deploy modes. |
| **Docs aligned with code?** | Yes — endpoints, OR filter, adopt guard, validation, CORS Mode A/B, UX states. |
| **Ready for v1 MVP development?** | Yes. |
| **Production ops handbook complete?** | Partial — `/health/ready` and unit tests in place; integration tests and observability remain v1.1. |

---

## Prior findings — resolution

| ID | Issue | Resolution | Status |
|----|-------|------------|--------|
| **C1** | Dual status enums | [state-machines.md](architecture/state-machines.md) documents v1 vs v2 | Resolved |
| **C2** | RLS anon INSERT vs BFF | [ERD](architecture/erd.md), NFR-2.6, [C4](architecture/c4.md) | Documented; v2 migration |
| **C3** | Adoption POST TOCTOU | [TDD.md](TDD.md) §4; v2 RPC in `v2-migration.sql` | Documented / v2 |
| **C4** | OpenAPI Pet nullability | [openapi.yaml](openapi.yaml) nullable fields | Resolved |
| **C5** | CORS vs proxy deploy | Mode A/B across C4, apiSpec, techspec | Resolved |

---

## Core 7 alignment

| Doc | Status |
|-----|--------|
| [PRD](PRD.md) | Aligned |
| [SRS](SRS.md) | Aligned |
| [C4](architecture/c4.md) | Aligned |
| [openapi.yaml](openapi.yaml) | Canonical API contract |
| [ERD](architecture/erd.md) | Aligned |
| [user-flows](ux-ui-flows/user-flows.md) | Aligned |
| [TDD](TDD.md) | Aligned |

---

## Known gaps (scoped, not blocking MVP)

| Gap | Version | Reference |
|-----|---------|-----------|
| Adoption TOCTOU (without v2 RPC) | v2 | TDD §4 |
| RLS anon INSERT | v2 | ERD, NFR-2.6 |
| Pet status auto-transition on submit | v2 | state-machines |
| Server pagination at scale | v2 | SRS NFR-1.4 |
| GET rate limiting | v2 | C4 |
| Integration / E2E test suite | v1.1 | PRD roadmap |

---

## Sign-off

| Area | Status |
|------|--------|
| Doc pack (core 7) | Approved |
| Code ↔ doc sync (v1 MVP) | Approved |
| Production ops | Conditional (v1.1) |

Related: [Doc pack index](README.md) · [PRD](PRD.md) · [OpenAPI](openapi.yaml)

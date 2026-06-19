# Roadmap loop plan

Sentinel (v1): `AGENT_LOOP_TICK_ROADMAP10` · Sentinel (v2): `AGENT_LOOP_TICK_ROADMAP_V20`

Each tick: docs = ground truth → `npm run lint` + `npm run lint:api` + `npm test` + `npm run validate:openapi` → complete next row.

## v1 loops (complete)

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

## v2.0 loops (complete)

| Loop | Focus | Status |
|------|-------|--------|
| V2-1 | `v2-migration.sql` — `review_adoption_application` RPC | ✅ |
| V2-2 | Backend admin API + `ADMIN_API_KEY` + pet `?status&tag&q` filters | ✅ |
| V2-3 | Frontend `/admin/login`, `/admin/applications`, Header login | ✅ |
| V2-4 | OpenAPI 2.0 + apiSpec admin endpoints | ✅ |
| V2-5 | SRS FR-5, PRD F7 routes, `.env.example` | ✅ |
| V2-6 | Validation tests + full verify | ✅ |

## Operator setup (v2)

1. Run `schema.sql` then `v2-migration.sql` on Supabase.
2. Set `ADMIN_API_KEY` in `.env`.
3. `npm run dev:api` + `npm run dev` → `/admin/login` → review pending apps.

## v2.1+ (future)

- End-user OAuth (Supabase Auth)
- Email notifications
- E2E tests + observability
- UI server-side pagination (API exists; list still client-filters in v2.0)

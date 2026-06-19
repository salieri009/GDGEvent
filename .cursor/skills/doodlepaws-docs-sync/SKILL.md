---
name: doodlepaws-docs-sync
description: Updates DoodlePaws pre-development doc pack (PRD, SRS, C4, OpenAPI, ERD, user flows, TDD) when API, architecture, or UX changes. Use after modifying backend routes, frontend pages, schema.sql, or env vars.
disable-model-invocation: true
---

# DoodlePaws Docs Sync

## Pre-dev core 7

1. `docs/PRD.md`
2. `docs/SRS.md`
3. `docs/architecture/c4.md`
4. `docs/apiSpec.md` + `docs/openapi.yaml`
5. `docs/architecture/erd.md`
6. `docs/ux-ui-flows/user-flows.md`
7. `docs/TDD.md`

Index: `docs/README.md`

## Workflow

```
- [ ] Identify affected docs from change map
- [ ] Update OpenAPI + apiSpec together
- [ ] Update SRS FR/NFR IDs if behavior changed
- [ ] Update TDD sequences if implementation changed
- [ ] Update user-flows if routes/states changed
- [ ] Verify README Documentation section
```

## Change map

| Source | Docs |
|--------|------|
| `index.ts` | openapi.yaml, apiSpec, SRS, TDD |
| `schema.sql` | erd, SRS, TDD |
| `App.tsx` / pages | user-flows, PRD routes |
| docker-compose / deploy | c4, overview |
| Product scope | PRD, SRS |

## OpenAPI checklist

- All 4 paths documented
- Pet + AdoptionApplication schemas match mappers
- Error responses 400, 404, 409, 429, 500, 503

---
name: doodlepaws-code-review
description: Reviews DoodlePaws code for bugs, security, and UX regressions. Use when reviewing pull requests, src/ changes, or when the user asks for a code review on this project.
disable-model-invocation: true
---

# DoodlePaws Code Review

## Quick start

Review changes against this checklist. Report findings by severity (Critical → High → Medium → Low).

## Critical

- [ ] All `petService` / `adoptionService` calls have try/catch/finally; loading never stuck
- [ ] `ApiError` used for HTTP status (404 via `status === 404`, not string matching)
- [ ] No secrets in frontend bundle (`SUPABASE_SERVICE_ROLE_KEY`, API keys in `vite.config.ts`)

## High (security)

- [ ] CORS: production requires explicit `CORS_ORIGIN`
- [ ] Adoption POST: validation, pet availability check, rate limit
- [ ] 500 responses generic; no PostgREST message leakage

## Medium (UX / correctness)

- [ ] `pet.status` drives badges and adopt CTA visibility
- [ ] No hardcoded pet names or wrong counts in copy
- [ ] Nav links resolve to real routes or anchors (`/#why-doodlepaws`)
- [ ] PetCard rotation stable (no `Math.random()`)

## Low

- [ ] No dead files (`pets.json`, unused supabase client)
- [ ] Frontend/backend `Pet` types stay aligned
- [ ] Filter/search UI matches implemented behavior

## Output format

```markdown
| Severity | Location | Finding |
|----------|----------|---------|
| Critical | file:line | Description |
```

## References

- API spec: `docs/apiSpec.md`
- UX rules: `docs/ux-ui-flows/ux-ui-rules.md`
- Cursor rules: `.cursor/rules/doodlepaws-*.mdc`

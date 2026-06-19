---
name: doodlepaws-ux-review
description: PRD-driven UX/UI product audit for DoodlePaws. Reviews screens against PRD, user goals, flows, business scope, and usability (not aesthetics). Use when auditing UI, reviewing UX, checking PRD compliance, evaluating adoption flow usability, or when the user asks for a product alignment review of the frontend.
disable-model-invocation: true
---

# UX/UI Review Skills — PRD Driven Product Audit

## Purpose

Review the UI against:

1. Product Requirements Document (PRD)
2. User Goals
3. User Flows
4. Business Scope
5. Usability Principles

The objective is NOT to critique aesthetics.

The objective is to determine whether the interface successfully supports the intended product outcomes.

---

## Before You Review

1. Read `docs/PRD.md` — features F1–F9, scenarios S1–S3, non-goals
2. Read `docs/ux-ui-flows/user-flows.md` and `docs/ux-ui-flows/ux-ui-rules.md`
3. Read `docs/ux-ui-flows/adopt-application.md` when reviewing F5–F6
4. Inspect implemented screens in `src/frontend/src/features/**` and routes in `src/frontend/src/app/routes.tsx`
5. Do not review based solely on visual preference — always cite PRD requirements

---

# Review Method

For every screen:

1. Identify the user goal
2. Identify the intended action
3. Identify friction
4. Identify ambiguity
5. Identify missing requirements
6. Suggest improvements

Always reference the PRD.

Never review based solely on visual preference.

---

# Product Understanding

## Product

DoodlePaws

A lightweight dog adoption platform.

Primary Goal:

Allow prospective adopters to:

* Browse dogs
* Search/filter dogs
* View dog details
* Submit adoption applications

Secondary Goal:

Allow operators to run and maintain the application.

---

# Feature Validation

Review whether the UI fully supports:

## F1 Home

Questions:

* Is the adoption value proposition immediately clear?
* Is the Browse CTA visually dominant?
* Can users understand what DoodlePaws does within 5 seconds?

Red Flags:

* Generic hero copy
* Hidden CTA
* Competing actions

---

## F2 Pet List

Questions:

* Can users easily scan pets?
* Is status visible?
* Are cards comparable?

Red Flags:

* Inconsistent card layouts
* Missing status visibility
* Difficult scanning

---

## F3 Search + Filters

Questions:

* Are filters discoverable?
* Are active filters obvious?
* Does OR-filter behaviour feel intuitive?

Red Flags:

* Hidden filters
* Confusing tag interactions
* Poor mobile usability

---

## F4 Pet Detail

Questions:

* Can users quickly evaluate a dog?
* Is adoption status immediately visible?
* Is the Adopt CTA prominent?

Red Flags:

* Status below fold
* CTA buried
* Missing trust indicators

---

## F5 Adoption Form

Questions:

* Can users complete the form without confusion?
* Are required fields clear?
* Are validation messages understandable?

Red Flags:

* Long forms
* Ambiguous labels
* Poor error recovery

---

## F6 Success Confirmation

Questions:

* Does the user know what happens next?
* Is submission success obvious?

Red Flags:

* Weak confirmation state
* Sudden redirect without explanation

---

# User Flow Review

## Scenario S1

Home → Pets → Search → Detail

Evaluate:

* Number of clicks
* Navigation clarity
* Search effectiveness

Questions:

* Can users discover relevant dogs quickly?
* Are there dead ends?

---

## Scenario S2

Detail → Adopt → Submit → Success

Evaluate:

* Form completion effort
* Error handling
* User confidence

Questions:

* What could prevent completion?
* What creates hesitation?

---

# Information Hierarchy

Evaluate:

## Visual Priority

Can users identify:

1. Primary action
2. Secondary action
3. Status
4. Supporting information

within 3 seconds?

---

## Content Hierarchy

Evaluate:

* Headlines
* Descriptions
* Metadata
* Status labels
* Buttons

Red Flags:

* Equal emphasis everywhere
* Lack of focal point

---

# Layout Review

Evaluate:

## Spacing

Review:

* Padding
* Margin
* Gap consistency

Questions:

* Is spacing systematic?
* Does whitespace improve readability?

---

## Alignment

Review:

* Card alignment
* Form alignment
* Button alignment

Questions:

* Does the layout feel intentional?

---

# Component Review

## Buttons

Questions:

* Is the primary CTA obvious?
* Is button hierarchy clear?

---

## Forms

Questions:

* Are labels clear?
* Is validation immediate?
* Is error recovery simple?

---

## Cards

Questions:

* Are cards scannable?
* Is status visible?
* Is content density appropriate?

---

# Accessibility

Review:

* Keyboard navigation
* Contrast
* Focus states
* Mobile touch targets
* Semantic structure

Severity increases if issues block adoption flow completion.

---

# Mobile Review

Evaluate:

* Home
* Pet List
* Detail
* Adoption Form

Questions:

* Can users complete adoption entirely on mobile?
* Are filters usable on small screens?

---

# MVP Scope Compliance

Review against Non-Goals.

Flag any UI that suggests:

* User accounts
* Authentication
* Payments
* Email workflows
* Unsupported functionality

The interface should accurately represent MVP capabilities.

---

# Severity Scale

## Critical

Blocks adoption flow.

Examples:

* Cannot submit application
* Broken navigation
* Hidden adoption CTA

---

## High

Strongly harms completion rate.

Examples:

* Confusing filters
* Poor mobile usability

---

## Medium

Creates friction.

Examples:

* Weak hierarchy
* Excessive scrolling

---

## Low

Polish issue.

Examples:

* Minor spacing inconsistency
* Typography refinement

---

# Required Review Output

## Executive Summary

UX Score: X/10
UI Score: X/10

---

## Product Alignment

PRD Compliance: Pass / Partial / Fail

Missing Requirements:

* ...

Overbuilt Features:

* ...

---

## Strengths

* ...
* ...
* ...

---

## Critical Issues

* ...

---

## High Priority Issues

* ...

---

## Medium Priority Issues

* ...

---

## Low Priority Issues

* ...

---

## Recommended Fixes

### Before Release

* ...

### Next Iteration

* ...

### Future Enhancements

* ...

---

# Final Principle

Judge the interface based on whether it helps users successfully adopt a dog.

Do not optimize for visual trends at the expense of usability.

---

## References

| Doc | Use |
|-----|-----|
| `docs/PRD.md` | Feature list, scenarios, non-goals |
| `docs/ux-ui-flows/user-flows.md` | S1/S2 flow diagrams, use cases |
| `docs/ux-ui-flows/ux-ui-rules.md` | Loading, errors, copy, tokens |
| `docs/ux-ui-flows/adopt-application.md` | F5/F6 form and success behavior |
| `.cursor/rules/doodlepaws-ux-ui.mdc` | Design tokens and component patterns |

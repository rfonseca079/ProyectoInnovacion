# Design

## Context

Depends on the signed-in teacher from US-01 and the list from US-03. See proposal.md. Scenario choice is a database lookup, not generation.

## Goals / Non-Goals

**Goals:**

- Validate `PlanConfiguration` and create a draft on step 1 with variant 1 loaded.
- Re-resolve the scenario when the match key changes, without overwriting accepted or edited blocks.

**Non-Goals:**

- Filling steps 2 through 8. Those open on first visit in their own changes, using the same variant-1 rule from US-16.

## Decisions

- Prefill `teacherName`, `schoolName`, and `regionalDirectorate` from `GET /api/auth/me`. Other fields start empty.
- `POST /api/plans` checks grade against cycle (`I_II` 1–6, `III` 7–9, `DIVERSIFIED` 10–11) and requires `studentCount` and `weeklyLessons` greater than zero.
- Match `schoolYear + subject + gradeLevel + month`. No row means `scenarioId = mat-4-marzo-2026` and `usedFallback = true`.
- On a later `PATCH` of the match key, reload only `PlanBlock` rows whose status is `SUGGESTED`.

Alternative considered: copying every step's variant 1 at create time. Rejected so unvisited steps stay closed until Continuar, matching US-06.

## Risks / Trade-offs

- [Fallback still shows mathematics text under another subject] → The spec requires the visible Spanish notice. The header keeps the teacher's configuration.

## Migration Plan

Add `Plan` and the scenario foreign key. Rollback drops plans created by this flow; seeded plans from US-03 stay if that migration already ran.

## Open Questions

None.

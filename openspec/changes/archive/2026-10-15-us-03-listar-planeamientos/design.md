# Design

## Context

Depends on `us-01-iniciar-sesion` for the session teacher. See proposal.md. The three demo plans are seed data, not rows built when the list opens.

## Goals / Non-Goals

**Goals:**

- Return `PlanSummary` rows for the session teacher only.
- Open a plan at `currentStep` and respect `highestVisitedStep`.

**Non-Goals:**

- Creating a plan (US-04) and rendering wizard steps (US-06 onward).

## Decisions

- `GET /api/plans` filters by `teacherId` and orders by `updatedAt` descending. It does not include block bodies. The empty sentence is shown only after that response contains zero rows. A failed request shows "No se pudieron cargar los planeamientos." and does not use the empty sentence.
- Spanish labels are a view mapping: `DRAFT` plus `currentStep` becomes "Borrador · Paso N de 8"; `READY_FOR_DELIVERY` and `ADJUSTED` use the labels in the spec.
- Opening a row navigates to `/plans/:planId/steps/:currentStep`. The page calls `GET /api/plans/:planId`, which returns 404 for another teacher. The visited-step bar stays in wizard navigation.
- Seed Juanita at step 4, Carlos at step 7 with `highestVisitedStep` 7, and María at step 8 with the adjustment not applied.

Alternative considered: translating status in the API. Rejected so the stored enum stays stable and the UI owns the Spanish copy.

## Risks / Trade-offs

- [List opens before wizard pages exist] → The route may render a placeholder step shell until US-06, but the API contract for the list is complete in this change.

## Migration Plan

Seed runs in development only. Rollback removes the three plan rows and the list route.

## Open Questions

None.

# Design

## Context

See proposal.md. Steps are a single plan field pair, `currentStep` and `highestVisitedStep`, not a separate workflow engine.

## Goals / Non-Goals

**Goals:**

- Render one desktop chrome for every step.
- Advance only through `POST .../steps/:step/continue` when the step is valid.

**Non-Goals:**

- Free jumping to an unvisited step, a mobile bar, or step-specific form fields beyond calling each step's own validator.

## Decisions

- The plan list is `/planeamientos`. New-plan and step routes are `/plans/new` and `/plans/:planId/steps/:step`.
- The bar enables steps `0..highestVisitedStep` inclusive, and only those indexes from 0 through 8. An address outside that range returns to `highestVisitedStep`. Atrás and visited clicks do not call continue. Another teacher's continue returns 404.
- Continue returns 422 with the missing-field message and does not increment `highestVisitedStep`. Success sets `currentStep` to the next step, raises `highestVisitedStep`, and saves.
- Step 2's validator requires the rubric total to be 100. Step 8 has no Continuar control. Step 0 Atrás navigates to `/planeamientos`. An empty teacher name and an empty school are separate messages.
- Chrome is one component so later step pages do not redraw the header.

Alternative considered: storing a boolean per step. Rejected because the product rule is a single visited prefix, not arbitrary holes.

## Risks / Trade-offs

- [Step validators arrive in later changes] → This change ships the continue endpoint with a registry of validators. Steps without a validator yet reject continue with a clear 422 rather than opening an empty step.

## Migration Plan

Add `highestVisitedStep` if US-03 did not. Rollback restores direct navigation only for seeded plans.

## Open Questions

None.

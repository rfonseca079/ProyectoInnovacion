# Design

## Context

See proposal.md. María's seed opens here with `adjustmentApplied` false. Apply writes a stored set; it does not compose a new plan from the log.

## Goals / Non-Goals

**Goals:**

- Save the comparison fields, three cards, log, and notification toggle.
- Replace session and MEP texts from `adjustment-week`, using edited card text when present.

**Non-Goals:**

- Sending email or any other notification, and inserting extra MEP rows on a second apply.

## Decisions

- Comparison fields and `teacherLog` use the autosave patch. Cards `adjustment-1` through `adjustment-3` use the shared suggestion routes.
- `notifyEvaluationChanges` defaults to false and is only persisted.
- `POST /api/plans/:planId/adjustments/apply` writes the scenario set into the target sessions and MEP rows inside one transaction. A card overrides the stored result only when its saved body differs from that card's base text and its status is `EDITED` or `ACCEPTED`. An unchanged blur does not save. Card 1's changed body also replaces the MEP mediation strategy, so the PDF includes it. Accepting a card without changing its text keeps the stored result sentences. The plan becomes `ADJUSTED` and `adjustmentApplied` becomes true.
- A second apply updates the same fields. It does not insert rows.
- Volver al formato MEP navigates to step 7. The page shows "Aún no hay ajustes aplicados." when the flag is false.

Alternative considered: deriving the Tuesday session by editing times in code. Rejected so the mathematics result sentences stay seed data and can differ per scenario.

## Risks / Trade-offs

- [Apply before the MEP document exists] → Build the document first, using the US-13 assembler, then write the adjustment into it.

## Migration Plan

Seed `adjustment-week` for the three scenarios, with María unapplied. Rollback clears `adjustmentApplied` and restores the pre-apply session text from the seed.

## Open Questions

None.

# Design

## Context

See proposal.md. Percentages are stored per rubric row. Redistribution is a lookup by row count, not a solver.

## Goals / Non-Goals

**Goals:**

- Enforce a 100 percent total before continue.
- Swap percentages from the next stored distribution with the same row count.

**Non-Goals:**

- Drag-and-drop persistence beyond editable titles, or generating a new percentage split.

## Decisions

- Week titles and `RubricItem` rows are part of the plan patch.
- The client shows the total immediately and disables Continuar from that visible total, including a change that has not finished saving. `continue` on step 2 repeats the sum check and returns 422 with "La distribución debe sumar 100 %."
- Each percentage is an integer from 0 through 100. Anything else is rejected and the stored rows stay.
- Add inserts a row at percentage 0. Remove refuses when one row would remain. Both buttons use the latest row list, including text typed in the same moment.
- `redistribute-evaluation` loads the next stored vector for that count, writes percentages only, and returns 409 when none exists. It claims the current variant before writing, so two overlapping calls do not apply the same vector twice.
- The justification card is `evaluation-justification` and uses the shared suggestion actions.

Alternative considered: scaling edited percentages to 100. Rejected because US-08 only allows stored distributions.

## Risks / Trade-offs

- [Teacher adds a sixth row and cannot redistribute] → The 409 message is the specified outcome. They can still type percentages that sum to 100.

## Migration Plan

Seed three distributions for the initial row count of each scenario. Rollback removes the action and the extra rows.

## Open Questions

None.

# Proposal

## Why

Step 2 fixes the month's sequence and the evaluation weights. The teacher cannot continue until the percentages sum to 100 percent, and Redistribuir con IA may only apply a stored distribution that matches the current number of rows.

## What Changes

- Show four editable week titles and a rubric table of name, count, and percentage.
- Show Distribución completa when the total is 100 and names are present.
- Block Continuar with the Spanish 100 percent message otherwise.
- Add a row at 0 percent and remove a row, but never the last row.
- Replace percentages from the next stored distribution for that row count, keeping edited names.
- Accept, edit, and regenerate the justification card.

## Capabilities

### New Capabilities

- `units-and-evaluation`: Week sequence, rubric rows, and stored percentage redistribution.

### Modified Capabilities

- None.

## Impact

- `RubricItem` and `Week.title` on the plan.
- `POST /api/plans/{planId}/actions/redistribute-evaluation` returning 409 when no distribution matches the row count.
- `frontend/src/pages/steps/UnitsStepPage.tsx`.
- Continue on step 2 returns 422 unless the total is 100.

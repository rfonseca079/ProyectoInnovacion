# Proposal

## Why

Class rarely follows the plan exactly. Step 8 records what happened and applies a stored adjustment to that week's sessions and to the MEP document, including María's seeded plan, which opens here before any adjustment is applied.

## What Changes

- Show planned versus executed fields for the reference session, plus achieved, pending, and collected evidence.
- Show three editable adjustment cards and the teacher log.
- Show the original week timeline until the adjustment is applied, then the stored updated week.
- Persist the notification toggle, default off, and send nothing.
- Apply the scenario's `adjustment-week` set, using an edited card's text when the teacher changed it.
- Set the plan to Ajustado, replace the same fields on a second apply, and let the updated MEP document and PDF show the change.
- Return to step 7 with an explicit notice when no adjustment has been applied yet.

## Capabilities

### New Capabilities

- `post-class-adjustment`: Post-class log and stored rewrite of the week's sessions and MEP rows.

### Modified Capabilities

- None.

## Impact

- `POST /api/plans/{planId}/adjustments/apply`.
- `notifyEvaluationChanges` stored only.
- `frontend/src/pages/steps/AdjustmentStepPage.tsx` and `applyAdjustments.ts`.
- Seeded mathematics result text for Tuesday 10 March and the matching MEP strategy.
- No email, queue, or webhook.

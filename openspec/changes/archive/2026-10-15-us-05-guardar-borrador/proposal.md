# Proposal

## Why

Teachers leave and return to a plan. US-05 requires the draft to save itself so accepted and edited text is still there, and so a failed save does not pretend it succeeded or clear the screen.

## What Changes

- Autosave on field blur, accept, edit, a regenerate that changes visible text, rubric add or remove, the notification toggle, applying adjustments, and step changes.
- Show Borrador guardado automáticamente after success.
- Show the Spanish failure sentence and keep the typed text on screen when the save fails.
- Reopen the plan on the last saved step with the last saved content.
- Update the list timestamp and keep another teacher's data hidden.

## Capabilities

### New Capabilities

- `plan-autosave`: Partial persistence of the working plan and the footer save state.

### Modified Capabilities

- None.

## Impact

- `PATCH /api/plans/{planId}` updating `updatedAt`.
- Footer in `WizardChrome.tsx` and `planService.ts`.
- `backend/src/application/updatePlan.ts`.
- Actions that already return a saved plan do not need a second patch.

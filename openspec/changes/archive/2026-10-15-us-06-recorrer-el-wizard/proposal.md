# Proposal

## Why

The planning flow is a fixed sequence of steps. Teachers must move forward only when the current step is valid, and they must still reopen a step they already visited to correct it.

## What Changes

- Add the shared desktop header, nine-step bar, and footer.
- Show Paso X de 8 on steps 1 through 8 only.
- Enable Continuar only after validation, including the 100 percent rubric rule on step 2.
- Allow Atrás and clicks on visited steps even when the current step is invalid.
- Keep unvisited steps visible and not clickable.
- Remove Continuar from step 8. From configuration, Atrás returns to the plan list.

## Capabilities

### New Capabilities

- `wizard-navigation`: Shared chrome and the visited-step movement rules.

### Modified Capabilities

- None.

## Impact

- Routes `/planeamientos`, `/plans/new`, and `/plans/:planId/steps/:step`.
- `POST /api/plans/{planId}/steps/{step}/continue`.
- `frontend/src/components/WizardChrome.tsx` and `backend/src/application/continueStep.ts`.
- Desktop width 1440px. No mobile layout.

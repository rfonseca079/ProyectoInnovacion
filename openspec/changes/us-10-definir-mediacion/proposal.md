# Proposal

## Why

Step 4 states what happens inside and outside class for the active week: teacher role, student role, time, and materials. Juanita's seeded plan opens here, so this screen is the first resume point of the demo.

## What Changes

- Show the scenario's active week and the in-class rows plus out-of-class tasks.
- Allow edits to those rows with autosave.
- Add three named actions with their own stored cycles: regenerate mediation, fit the times to 40 minutes, and simplify materials.
- Those actions replace visible text and return the blocks to suggested, even if they were accepted or edited.
- Allow Continuar when every in-class row has a time. Do not require the times to sum to 40.

## Capabilities

### New Capabilities

- `mediation`: In-class and out-of-class mediation for the active week, including the 40-minute and simplified-material variants.

### Modified Capabilities

- None.

## Impact

- Blocks `mediation-in-class` and `mediation-outside`.
- Actions `regenerate-mediation`, `fit-40-minutes`, and `simplify-materials`.
- `frontend/src/pages/steps/MediationStepPage.tsx`.
- Seeded 8+14+12+6 minute variant and the simplified material set.

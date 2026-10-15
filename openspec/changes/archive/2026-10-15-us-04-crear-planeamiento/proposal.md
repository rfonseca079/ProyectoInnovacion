# Proposal

## Why

A new plan starts from curricular context, and that context chooses which stored suggestion pack fills the wizard. US-04 is the step 0 screen that creates the plan and resolves the scenario.

## What Changes

- Add Nuevo planeamiento at `/plans/new`, without the "Paso X de 8" indicator.
- Prefill the teacher's name, school, and regional directorate from the account, and leave the other fields empty.
- Enable Iniciar planeamiento con IA only when every required field is valid, including grade-within-cycle and positive integers.
- Create the plan, attach the matching scenario or the mathematics fallback, mark steps 0 and 1 visited, and open step 1 filled with variant 1.
- Re-resolve the scenario when year, subject, grade, or month changes, reloading only blocks still marked suggested.

## Capabilities

### New Capabilities

- `plan-creation`: Configuration form, validation, scenario selection, and first-step seeding.

### Modified Capabilities

- None.

## Impact

- `POST /api/plans` with `PlanConfiguration` and `PATCH /api/plans/{planId}` when configuration changes.
- `frontend/src/pages/PlanConfigPage.tsx` and `backend/src/application/createPlan.ts`.
- Catalogs and fallback rule in `docs/data-model.md`.
- No language-model call to choose or write the scenario.

# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-04-crear-planeamiento` before any code change, and verify `git status` shows that branch

## 2. New plan

- [x] 2.1 Implement scenario lookup and the mathematics fallback, and verify a Jest test maps Juanita's March mathematics input to `mat-4-marzo-2026` and Estudios Sociales to the fallback flag
- [x] 2.2 Implement `POST /api/plans` validation for grade, cycle, and positive counts, and verify a test returns the Spanish cycle message for grade 4 in diversified education
- [x] 2.3 Build `PlanConfigPage` with account prefill, chips, and a disabled start button, and verify a component test keeps the button disabled while month is empty
- [x] 2.4 On a later match-key patch, reload only `SUGGESTED` blocks, and verify a test keeps an `ACCEPTED` block's text
- [x] 2.5 Update `docs/data-model.md` scenario rules if the match key differs, and verify the documented key is year, subject, grade, and month

## 3. Mandatory verification

- [x] 3.1 Review creation tests for the 201 response and step 1 variant, and verify they pass
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-04-crear-planeamiento/specs/plan-creation/reports/`
- [x] 3.3 Create Juanita's reference plan with curl, and verify `scenarioId` is `mat-4-marzo-2026` and `currentStep` is 1
- [x] 3.4 Run Playwright through Nuevo planeamiento until step 1, and verify the fractions extract is visible
- [x] 3.5 Update `docs/api-spec.yml` `PlanConfiguration` if a field was added, and verify the example matches the form

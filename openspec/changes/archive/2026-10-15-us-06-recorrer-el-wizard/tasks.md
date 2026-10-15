# Tasks

## 1. Branch

- [x] 1.1 Create and switch to `feature/us-06-recorrer-el-wizard` before any code change, and verify `git status` shows that branch

## 2. Wizard chrome

- [x] 2.1 Implement `POST /api/plans/:planId/steps/:step/continue` so an invalid step returns 422 and does not raise `highestVisitedStep`. An empty section names Sección o grupo, an empty teacher name names Nombre docente, and another teacher receives 404. Verify those Jest tests
- [x] 2.2 Build `WizardChrome` with the nine labels, Paso X de 8, and header context, and verify a component test hides the step indicator on step 0
- [x] 2.3 Enable only visited steps, return an address below 0 or above 8 to the highest visited step, and keep step 8 without Continuar. Verify a component test that Juanita's step 5 is not clickable when `highestVisitedStep` is 4 and that `/steps/-1` returns to step 4
- [x] 2.4 Wire Atrás from step 0 to `/planeamientos`, and verify the navigation test
- [x] 2.5 Document the continue route in `docs/api-spec.yml`. The 200 response marks the next step visited and does not claim a variant copy. The 422 response is listed

## 3. Mandatory verification

- [x] 3.1 Review navigation tests for the seeded visit limits of the three teachers, and verify they pass
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-06-recorrer-el-wizard/specs/wizard-navigation/reports/`
- [x] 3.3 Continue a valid step and an invalid step with curl, and verify only the valid call changes `highestVisitedStep`
- [x] 3.4 Run Playwright across Atrás, Continuar, and a visited step at 1440px, and verify an unvisited step does not open
- [x] 3.5 Update `docs/frontend-standards.md` if the route names differ from `/plans/:planId/steps/:step`, and verify the doc matches `App.tsx`

# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-06-recorrer-el-wizard` before any code change, and verify `git status` shows that branch

## 2. Wizard chrome

- [ ] 2.1 Implement `POST /api/plans/:planId/steps/:step/continue` so an invalid step returns 422 and does not raise `highestVisitedStep`, and verify that Jest test
- [ ] 2.2 Build `WizardChrome` with the nine labels, Paso X de 8, and header context, and verify a component test hides the step indicator on step 0
- [ ] 2.3 Enable only visited steps and keep step 8 without Continuar, and verify a component test that Juanita's step 5 is not clickable when `highestVisitedStep` is 4
- [ ] 2.4 Wire Atrás from step 0 to the plan list, and verify the navigation test
- [ ] 2.5 Document the continue route in `docs/api-spec.yml`, and verify the 200 and 422 responses are listed

## 3. Mandatory verification

- [ ] 3.1 Review navigation tests for the seeded visit limits of the three teachers, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-06-recorrer-el-wizard/specs/wizard-navigation/reports/`
- [ ] 3.3 Continue a valid step and an invalid step with curl, and verify only the valid call changes `highestVisitedStep`
- [ ] 3.4 Run Playwright across Atrás, Continuar, and a visited step at 1440px, and verify an unvisited step does not open
- [ ] 3.5 Update `docs/frontend-standards.md` if the route names differ from `/plans/:planId/steps/:step`, and verify the doc matches `App.tsx`

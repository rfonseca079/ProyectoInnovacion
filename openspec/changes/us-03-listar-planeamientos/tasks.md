# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-03-listar-planeamientos` before any code change, and verify `git status` shows that branch

## 2. Plan list

- [x] 2.1 Seed Juanita, Carlos, and María with the plans and visit limits from US-03, and verify a Jest seed test finds one plan per teacher
- [x] 2.2 Implement `GET /api/plans` and `GET /api/plans/:planId` scoped by the session teacher, and verify a test hides another teacher's plan with 404
- [x] 2.3 Build `PlanListPage` with the Spanish status labels, empty state, and Nuevo planeamiento, and verify a component test renders Juanita's "Borrador · Paso 4 de 8"
- [x] 2.4 Point the list columns at `docs/api-spec.yml` `PlanSummary`, and verify every rendered column exists on that schema

## 3. Mandatory verification

- [x] 3.1 Review plan-query tests and cover the three status labels, and verify those tests pass
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-03-listar-planeamientos/specs/plan-list/reports/`
- [x] 3.3 Call `GET /api/plans` with curl as each demo teacher, and verify each body contains only that teacher's row
- [x] 3.4 Run Playwright signed in as Carlos and open his row, and verify the address is step 7
- [x] 3.5 Update `docs/data-model.md` if `currentStep` or `highestVisitedStep` changed, and verify the seed dates match the story

# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-09-registrar-diagnostico-del-grupo` before any code change, and verify `git status` shows that branch

## 2. Group profile

- [ ] 2.1 Seed the six profile fields and three implication sets, including the number-line sentence, and verify a Jest lookup of that sentence
- [ ] 2.2 Block step 3 continue when any of the six fields is empty, and verify the 422 names the field
- [ ] 2.3 Implement `generate-implications` so one call replaces all three cards, and verify a single-card regenerate does not change the other two
- [ ] 2.4 Build `GroupStepPage` without an accommodations section, and verify a component test finds no such heading
- [ ] 2.5 Record the implication block keys in `docs/data-model.md`, and verify the seed uses those keys

## 3. Mandatory verification

- [ ] 3.1 Review group tests so the first successful continue sets `highestVisitedStep` to at least 4, and verify that test passes
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-09-registrar-diagnostico-del-grupo/specs/group-diagnosis/reports/`
- [ ] 3.3 Call `generate-implications` with curl and verify the three card bodies change together
- [ ] 3.4 Run Playwright on step 3, clear one field, and verify Continuar does not advance
- [ ] 3.5 Update `docs/api-spec.yml` if `generate-implications` was missing, and verify the action key matches the button

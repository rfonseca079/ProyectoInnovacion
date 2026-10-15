# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-10-definir-mediacion` before any code change, and verify `git status` shows that branch

## 2. Mediation

- [ ] 2.1 Seed the mathematics week 2 rows, the 8+14+12+6 variant, and the simplified materials, and verify a test that those minutes sum to 40
- [ ] 2.2 Implement `regenerate-mediation`, `fit-40-minutes`, and `simplify-materials` so each replaces visible text and sets `SUGGESTED`, and verify the three Jest cases
- [ ] 2.3 Allow continue when every row has minutes even if the total is not 40, and verify a 60-minute total still returns 200
- [ ] 2.4 Build `MediationStepPage` with both tables, and verify Juanita's seeded plan opens on this step
- [ ] 2.5 List the three action keys in `docs/api-spec.yml`, and verify the page calls those keys

## 3. Mandatory verification

- [ ] 3.1 Review mediation tests for the Spanish and science signature activities, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-10-definir-mediacion/specs/mediation/reports/`
- [ ] 3.3 Call `fit-40-minutes` with curl and verify the returned minutes are 8, 14, 12, and 6
- [ ] 3.4 Run Playwright as Juanita and confirm step 4 is the landing step, and verify the in-class columns are visible
- [ ] 3.5 Update `docs/data-model.md` if the row JSON shape changed, and verify the seed still matches US-10

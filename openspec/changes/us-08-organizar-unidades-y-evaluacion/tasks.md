# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-08-organizar-unidades-y-evaluacion` before any code change, and verify `git status` shows that branch

## 2. Units and rubric

- [ ] 2.1 Seed the four week titles and the three five-row distributions, and verify a test that 30+20+15+20+15 equals 100
- [ ] 2.2 Reject continue on step 2 unless the total is 100 and names exist, and verify the 422 body is "La distribución debe sumar 100 %."
- [ ] 2.3 Add a zero-percent row and refuse to remove the last row, and verify both Jest cases
- [ ] 2.4 Implement `redistribute-evaluation` to change percentages only and return 409 for an unknown row count, and verify the 25, 15, 20, 25, 15 result
- [ ] 2.5 Show Distribución completa in `UnitsStepPage`, and verify the component test
- [ ] 2.6 Document the 409 case in `docs/api-spec.yml`, and verify the message matches the UI

## 3. Mandatory verification

- [ ] 3.1 Review rubric tests after the justification card cycle is wired, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-08-organizar-unidades-y-evaluacion/specs/units-and-evaluation/reports/`
- [ ] 3.3 Redistribute with curl and read the rubric, and verify names are unchanged
- [ ] 3.4 Run Playwright that adds a row and checks Continuar stays disabled, and verify the total is no longer 100
- [ ] 3.5 Update `docs/data-model.md` `RubricItem` if a column was added, and verify the seed still sums to 100

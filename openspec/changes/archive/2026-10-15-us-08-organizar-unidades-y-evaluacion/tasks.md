# Tasks

## 1. Branch

- [x] 1.1 Create and switch to `feature/us-08-organizar-unidades-y-evaluacion` before any code change, and verify `git status` shows that branch

## 2. Units and rubric

- [x] 2.1 Seed the four week titles and the three five-row distributions, and verify a test that 30+20+15+20+15 equals 100
- [x] 2.2 Reject continue on step 2 unless the total is 100 and names exist, and verify the 422 body is "La distribución debe sumar 100 %."
- [x] 2.3 Add a zero-percent row and refuse to remove the last row, and verify both Jest cases
- [x] 2.4 Implement `redistribute-evaluation` to change percentages only and return 409 for an unknown row count, and verify the 25, 15, 20, 25, 15 result
- [x] 2.5 Show Distribución completa in `UnitsStepPage`, and verify the component test
- [x] 2.6 Document the 409 case in `docs/api-spec.yml`, and verify the message matches the UI
- [x] 2.8 Disable Continuar from the visible total, reject a percentage outside 0–100, claim the next redistribute variant once, and keep Quitar and Agregar on the latest row list

## 3. Mandatory verification

- [x] 3.1 Review rubric tests after the justification card cycle is wired, and verify they pass
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-08-organizar-unidades-y-evaluacion/specs/units-and-evaluation/reports/`
- [x] 3.3 Redistribute with curl and read the rubric, and verify names are unchanged
- [x] 3.4 Run Playwright that adds a zero-percent row and checks Continuar stays disabled, and verify the total remains 100 because the new row has no name
- [x] 3.5 Update `docs/data-model.md` `RubricItem` if a column was added, and verify the seed still sums to 100

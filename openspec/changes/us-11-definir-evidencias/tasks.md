# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-11-definir-evidencias` before any code change, and verify `git status` shows that branch

## 2. Evidence

- [ ] 2.1 Seed formative and scheduled evidence plus three loads per scenario, and verify the second mathematics load uses 20 March
- [ ] 2.2 Implement `balance-assessment-load` with rubric-name matching and 409 when nothing matches, and verify both Jest cases
- [ ] 2.3 Show the non-teaching-day warning without blocking continue, and verify a holiday card still allows step 6 when both columns are complete
- [ ] 2.4 Build `EvidenceStepPage` with the two columns and four fields, and verify a component test renders Quiz 1 on 13 March for variant 1
- [ ] 2.5 Document the 409 message in `docs/api-spec.yml`, and verify it matches the UI string

## 3. Mandatory verification

- [ ] 3.1 Review evidence tests so an incomplete card blocks continue, and verify that test passes
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-11-definir-evidencias/specs/learning-evidence/reports/`
- [ ] 3.3 Call the balance action with curl on the seeded mathematics rubric, and verify the quiz date changes and the written test stays on 27 March
- [ ] 3.4 Run Playwright and trigger the holiday warning, and verify Continuar still works
- [ ] 3.5 Update `docs/data-model.md` `Evidence` fields if one was added, and verify `kind` is only `FORMATIVE` or `SCHEDULED`

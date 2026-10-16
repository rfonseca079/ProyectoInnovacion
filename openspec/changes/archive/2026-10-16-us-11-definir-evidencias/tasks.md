# Tasks

## 1. Branch

- [x] 1.1 Create and switch to `feature/us-11-definir-evidencias` before any code change, and verify `git status` shows that branch

## 2. Evidence

- [x] 2.1 Seed formative and scheduled evidence plus three loads per scenario, and verify the second mathematics load uses 20 March
- [x] 2.2 Implement `balance-assessment-load` with rubric-name matching and 409 when nothing matches, and verify both Jest cases
- [x] 2.3 Show the non-teaching-day warning without blocking continue, and verify a holiday card still allows step 6 when both columns are complete
- [x] 2.4 Build `EvidenceStepPage` with the two columns and four fields, and verify a component test renders Quiz 1 on 13 March for variant 1
- [x] 2.5 Document the 409 message in `docs/api-spec.yml`, and verify it matches the UI string
- [x] 2.6 Write the failing test that one balance keeps an edited rubric percentage, keeps formative cards, and still moves the quiz to 20 March. Run it and record the failure. Do not add or edit production code in this task.
- [x] 2.7 Keep rubric count and percentage on every balance except the third mathematics load, so the test from 2.6 passes. Run that same test and record the pass. Do not start this task until 2.6 is checked.
- [x] 2.8 Write the failing test that two overlapping balance requests apply only the 20 March load. Run it and record the failure. Do not add or edit production code in this task.
- [x] 2.9 Make a lost claim return without applying another load, and ignore balance clicks while a request is in flight, so the test from 2.8 passes. Run that same test and record the pass. Do not start this task until 2.8 is checked.
- [x] 2.10 Write the failing test that reordered seeded rubric names still balance to 20 March. Run it and record the failure. Do not add or edit production code in this task.
- [x] 2.11 Match rubric names as a set, so the test from 2.10 passes. Run that same test and record the pass. Do not start this task until 2.10 is checked.
- [x] 2.12 Assert the eight mathematics variant 1 cards, the suspended-day warning, and that a card with no `occursOn` does not warn. Record the result.

## 3. Mandatory verification

- [x] 3.1 Review evidence tests so an incomplete card blocks continue, and verify that test passes
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-11-definir-evidencias/specs/learning-evidence/reports/`
- [x] 3.3 Call the balance action with curl on the seeded mathematics rubric, and verify the quiz date changes and the written test stays on 27 March
- [x] 3.4 Run Playwright and trigger the holiday warning, and verify Continuar still works
- [x] 3.5 Update `docs/data-model.md` `Evidence` fields if one was added, and verify `kind` is only `FORMATIVE` or `SCHEDULED`

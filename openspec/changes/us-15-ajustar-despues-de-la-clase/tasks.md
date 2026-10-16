# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-15-ajustar-despues-de-la-clase` before any code change, and verify `git status` shows that branch

## 2. Post-class adjustment

- [ ] 2.1 Write the failing test that `adjustment-week` is seeded for the three scenarios and that María's plan opens on step 8 with the flag false. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code, including the seed, in this task. Mark complete only after that failure has been observed.
- [ ] 2.2 Seed `adjustment-week` for the three scenarios and leave María unapplied so the test from 2.1 passes. Run that same test and record the pass. Do not start this task until 2.1 is checked.

- [ ] 2.3 Write the failing Jest cases that apply runs inside one transaction, changes the Tuesday session and the MEP strategy, sets status to `ADJUSTED`, and does not add rows on a second apply. Run them and record the command, each test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after those failures have been observed.
- [ ] 2.4 Implement apply inside one transaction so the tests from 2.3 pass. Run those same tests and record the pass. Do not start this task until 2.3 is checked.

- [ ] 2.5 Write the failing test that an edited card body is used instead of the base string. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.6 Use the edited card body so the test from 2.5 passes. Run that same test and record the pass. Do not start this task until 2.5 is checked.

- [ ] 2.7 Write the failing test that saving the notification toggle does not send a message and makes no outbound mail or HTTP call. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.8 Save the notification toggle without sending a message so the test from 2.7 passes. Run that same test and record the pass. Do not start this task until 2.7 is checked.

- [ ] 2.9 Write the failing component test for `AdjustmentStepPage` and the return notice "Aún no hay ajustes aplicados.". Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.10 Build `AdjustmentStepPage` and that return notice so the test from 2.9 passes. Run that same test and record the pass. Do not start this task until 2.9 is checked.

- [ ] 2.11 Document `POST /api/plans/{planId}/adjustments/apply` in `docs/api-spec.yml`, and verify the status values include `ADJUSTED`

## 3. Mandatory verification

- [ ] 3.1 Review adjustment tests for the mathematics Tuesday sentences, and verify they pass. This review does not replace the failing-test tasks above.
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-15-ajustar-despues-de-la-clase/specs/post-class-adjustment/reports/`
- [ ] 3.3 Apply with curl and read the MEP row, and verify the retake strategy is stored
- [ ] 3.4 Run Playwright as María, apply, and open step 7, and verify the updated strategy is visible
- [ ] 3.5 Update `docs/data-model.md` for `adjustmentApplied` and `notifyEvaluationChanges`, and verify the default is false

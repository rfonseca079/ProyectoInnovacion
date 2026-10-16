# Tasks

## 1. Branch

- [x] 1.1 Create and switch to `feature/us-15-ajustar-despues-de-la-clase` before any code change, and verify `git status` shows that branch

## 2. Post-class adjustment

- [x] 2.1 Write the failing test that `adjustment-week` is seeded for the three scenarios and that María's plan opens on step 8 with the flag false. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code, including the seed, in this task. Mark complete only after that failure has been observed.
- [x] 2.2 Seed `adjustment-week` for the three scenarios and leave María unapplied so the test from 2.1 passes. Run that same test and record the pass. Do not start this task until 2.1 is checked.

- [x] 2.3 Write the failing Jest cases that apply runs inside one transaction, changes the Tuesday session and the MEP strategy, sets status to `ADJUSTED`, and does not add rows on a second apply. Run them and record the command, each test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after those failures have been observed.
- [x] 2.4 Implement apply inside one transaction so the tests from 2.3 pass. Run those same tests and record the pass. Do not start this task until 2.3 is checked.

- [x] 2.5 Write the failing test that an edited card body is used instead of the base string. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.6 Use the edited card body so the test from 2.5 passes. Run that same test and record the pass. Do not start this task until 2.5 is checked.

- [x] 2.7 Write the failing test that saving the notification toggle does not send a message and makes no outbound mail or HTTP call. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.8 Save the notification toggle without sending a message so the test from 2.7 passes. Run that same test and record the pass. Do not start this task until 2.7 is checked.

- [x] 2.9 Write the failing component test for `AdjustmentStepPage` and the return notice "Aún no hay ajustes aplicados.". Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.10 Build `AdjustmentStepPage` and that return notice so the test from 2.9 passes. Run that same test and record the pass. Do not start this task until 2.9 is checked.

- [x] 2.11 Document `POST /api/plans/{planId}/adjustments/apply` in `docs/api-spec.yml`, and verify the status values include `ADJUSTED`

- [x] 2.12 Write the failing test that an unchanged card, even when marked edited, keeps the stored Tuesday result and the retake strategy. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.13 Ignore an unchanged card body so the test from 2.12 passes. Run that same test and record the pass. Do not start this task until 2.12 is checked.

- [x] 2.14 Write the failing test that a changed first card replaces the Tuesday start and the MEP strategy, and that the PDF includes that text. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.15 Write the changed first card into the MEP strategy so the test from 2.14 passes. Run that same test and record the pass. Do not start this task until 2.14 is checked.

- [x] 2.16 Write the failing test that accepting a changed card still uses that text for the Tuesday start and the MEP strategy. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.17 Keep an accepted edit so the test from 2.16 passes. Run that same test and record the pass. Do not start this task until 2.16 is checked.

- [x] 2.18 Write the failing component test that blurring an unchanged adjustment card does not save it. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.19 Save a card only when its text changed so the test from 2.18 passes. Run that same test and record the pass. Do not start this task until 2.18 is checked.

## 3. Mandatory verification

- [x] 3.1 Review adjustment tests for the mathematics Tuesday sentences, and verify they pass. This review does not replace the failing-test tasks above.
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-15-ajustar-despues-de-la-clase/specs/post-class-adjustment/reports/`
- [x] 3.3 Apply with curl and read the MEP row, and verify the retake strategy is stored
- [x] 3.4 Run Playwright as María, apply, and open step 7, and verify the updated strategy is visible
- [x] 3.5 Update `docs/data-model.md` for `adjustmentApplied` and `notifyEvaluationChanges`, and verify the default is false

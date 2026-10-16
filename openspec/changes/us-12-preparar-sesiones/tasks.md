# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-12-preparar-sesiones` before any code change, and verify `git status` shows that branch

## 2. Sessions

- [ ] 2.1 Write the failing test that weeks 1 through 4 have five sessions and that Monday and Wednesday of mathematics week 2 start expanded. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code, including the seed, in this task. Mark complete only after that failure has been observed.
- [ ] 2.2 Seed five sessions for weeks 1 through 4 and three sets for the active week so the test from 2.1 passes. Run that same test and record the pass. Do not start this task until 2.1 is checked.

- [ ] 2.3 Write the failing test for `generate-week-sessions`. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.4 Implement `generate-week-sessions` so the test from 2.3 passes. Run that same test and record the pass. Do not start this task until 2.3 is checked.

- [ ] 2.5 Write the failing tests for `duplicate-structure`: 409 when nothing is expanded, and a duplicate that keeps the other sessions' dates. Run them and record the command, each test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after those failures have been observed.
- [ ] 2.6 Implement `duplicate-structure` so the tests from 2.5 pass. Run those same tests and record the pass. Do not start this task until 2.5 is checked.

- [ ] 2.7 Write the failing test that continue requires learning, start, development, and close, and that a complete continue sets `READY_FOR_DELIVERY`. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.8 Implement that continue rule so the test from 2.7 passes. Run that same test and record the pass. Do not start this task until 2.7 is checked.

- [ ] 2.9 Write the failing component test that `SessionsStepPage` shows two expanded sessions and can request the week PDF. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.10 Build `SessionsStepPage` and the week PDF request so the test from 2.9 passes. Run that same test and record the pass. Do not start this task until 2.9 is checked.

- [ ] 2.11 Document `GET /api/plans/{planId}/weeks/{weekNumber}/pdf` in `docs/api-spec.yml`, and verify the filename pattern matches the spec

## 3. Mandatory verification

- [ ] 3.1 Review session tests for the Thursday plan B note, and verify they pass. This review does not replace the failing-test tasks above.
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-12-preparar-sesiones/specs/week-sessions/reports/`
- [ ] 3.3 Generate sessions with curl and verify five sessions return with status suggested
- [ ] 3.4 Run Playwright on the week selector and expand a collapsed session, and verify its date stays in that week
- [ ] 3.5 Update `docs/data-model.md` `Session` if a field was added, and verify homework remains optional

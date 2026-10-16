# Tasks

## 1. Branch

- [x] 1.1 Create and switch to `feature/us-12-preparar-sesiones` before any code change, and verify `git status` shows that branch

## 2. Sessions

- [x] 2.1 Write the failing test that weeks 1 through 4 have five sessions and that Monday and Wednesday of mathematics week 2 start expanded. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code, including the seed, in this task. Mark complete only after that failure has been observed.

  Recorded failure: `npx jest --runInBand tests/sessions.test.ts` — `week sessions seed › seeds five sessions for weeks 1 through 4 and expands Monday and Wednesday of mathematics week 2` — `relation "ClassSession" does not exist` (Prisma `42P01`).
- [x] 2.2 Seed five sessions for weeks 1 through 4 and three sets for the active week so the test from 2.1 passes. Run that same test and record the pass. Do not start this task until 2.1 is checked.

  Recorded pass: `npx jest --runInBand tests/sessions.test.ts` — `week sessions seed › seeds five sessions for weeks 1 through 4 and expands Monday and Wednesday of mathematics week 2`.

- [x] 2.3 Write the failing test for `generate-week-sessions`. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.

  Recorded failure: `npx jest --runInBand tests/sessions.test.ts -t "replaces the five sessions"` — `generate week sessions › replaces the five sessions of the selected week with the next stored set and marks them suggested` — `expect(received).toBe(expected)` expected status `200`, received `404`.
- [x] 2.4 Implement `generate-week-sessions` so the test from 2.3 passes. Run that same test and record the pass. Do not start this task until 2.3 is checked.

  Recorded pass: `npx jest --runInBand tests/sessions.test.ts` — `generate week sessions › replaces the five sessions of the selected week with the next stored set and marks them suggested`.

- [x] 2.5 Write the failing tests for `duplicate-structure`: 409 when nothing is expanded, and a duplicate that keeps the other sessions' dates. Run them and record the command, each test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after those failures have been observed.

  Recorded failure: `npx jest --runInBand tests/sessions.test.ts -t "duplicate structure"` — `duplicate structure › returns 409 when no session is expanded` expected `409`, received `404`. — `duplicate structure › copies Monday's structure and keeps the other sessions' dates` expected `200`, received `404`.
- [x] 2.6 Implement `duplicate-structure` so the tests from 2.5 pass. Run those same tests and record the pass. Do not start this task until 2.5 is checked.

  Recorded pass: `npx jest --runInBand tests/sessions.test.ts` — `duplicate structure › returns 409 when no session is expanded` and `duplicate structure › copies Monday's structure and keeps the other sessions' dates`.

- [x] 2.7 Write the failing test that continue requires learning, start, development, and close, and that a complete continue sets `READY_FOR_DELIVERY`. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.

  Recorded failure: `npx jest --runInBand tests/sessions.test.ts -t "complete continue"` — `continue from sessions › requires learning, start, development, and close, and a complete continue sets ready for delivery` — expected status `200`, received `422`.
- [x] 2.8 Implement that continue rule so the test from 2.7 passes. Run that same test and record the pass. Do not start this task until 2.7 is checked.

  Recorded pass: `npx jest --runInBand tests/sessions.test.ts` — `continue from sessions › requires learning, start, development, and close, and a complete continue sets ready for delivery`.

- [x] 2.9 Write the failing component test that `SessionsStepPage` shows two expanded sessions and can request the week PDF. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.

  Recorded failure: `npx vitest run src/pages/steps/SessionsStepPage.test.tsx` — failed to resolve `./SessionsStepPage` (`Failed to resolve import "./SessionsStepPage"`).
- [x] 2.10 Build `SessionsStepPage` and the week PDF request so the test from 2.9 passes. Run that same test and record the pass. Do not start this task until 2.9 is checked.

  Recorded pass: `npx vitest run src/pages/steps/SessionsStepPage.test.tsx` — `SessionsStepPage › shows two expanded sessions and can request the week PDF`.

- [x] 2.11 Document `GET /api/plans/{planId}/weeks/{weekNumber}/pdf` in `docs/api-spec.yml`, and verify the filename pattern matches the spec

  Recorded check: `npx jest --runInBand tests/sessions.test.ts -t "names the week PDF"` — `Content-Disposition` is `attachment; filename="semana-2-matematica-marzo-2026.pdf"`.

- [x] 2.12 Write the failing tests that a week PDF with accents has cross-reference offsets on each object and that a long line is wrapped. Run them and record the command, each test name, and the assertion or error that failed. Do not edit production code in this task.

  Recorded failure: `npx jest --runInBand tests/weekPdf.test.ts` — `points each cross-reference offset at an object and keeps the accented text` received `"obj << /"` instead of an object header. — `wraps a long development so no drawn line is wider than the page` expected every line length `<= 90`, received false.
- [x] 2.13 Make the PDF offsets and line wrapping match those tests. Run the same tests and record the pass. Do not start this task until 2.12 is checked.

  Recorded pass: `npx jest --runInBand tests/weekPdf.test.ts` — both week PDF tests.

- [x] 2.14 Write the failing test that generating a week without a stored set returns 409 and leaves the sessions unchanged, and the failing component test that Generar is disabled on a week that is not active. Run them and record each failure. Do not edit production code in this task.

  Recorded failure: `npx jest --runInBand tests/sessions.test.ts -t "no stored set"` expected `409`, received `404`. `npx vitest run src/pages/steps/SessionsStepPage.test.tsx` — `disables Generar on a week that is not active` — the button was not disabled.
- [x] 2.15 Implement that 409 and the disabled control so the tests from 2.14 pass. Run them and record the pass. Do not start this task until 2.14 is checked.

  Recorded pass: `npx jest --runInBand tests/sessions.test.ts -t "no stored set"` and `npx vitest run src/pages/steps/SessionsStepPage.test.tsx`.

- [x] 2.16 Write the failing test that exporting the week waits for a session save already in flight, and the failing test that a date outside the week is rejected and the stored date stays. Run them and record each failure. Do not edit production code in this task.

  Recorded failure: `npx vitest run src/pages/steps/SessionsExport.test.tsx` — `downloadWeekPdf` was called once before the save resolved. `npx jest --runInBand tests/sessions.test.ts -t "outside the week"` expected `422`, received `200`.
- [x] 2.17 Make export wait for that save and reject the outside date so the tests from 2.16 pass. Run them and record the pass. Do not start this task until 2.16 is checked.

  Recorded pass: `npx vitest run src/pages/steps/SessionsExport.test.tsx` and `npx jest --runInBand tests/sessions.test.ts -t "outside the week"`.

## 3. Mandatory verification

- [x] 3.1 Review session tests for the Thursday plan B note, and verify they pass. This review does not replace the failing-test tasks above.

  Recorded pass: `npx jest --runInBand tests/sessions.test.ts -t "expands Monday"` — Thursday `planBNote` contains the institutional sentence and `planBMinutes` is 25.
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-12-preparar-sesiones/specs/week-sessions/reports/`
- [x] 3.3 Generate sessions with curl and verify five sessions return with status suggested

  Recorded check: `POST /api/plans/11111111-1111-4111-8111-111111111111/actions/generate-week-sessions` returned 200. Week 2 sessions: Lunes, Martes, Miércoles, Jueves, and Viernes, each `SUGGESTED`.
- [x] 3.4 Run Playwright on the week selector and expand a collapsed session, and verify its date stays in that week

  Recorded pass: `npx playwright test e2e/sessions-step.spec.ts` — week 2 selected, Tuesday opens on 10 de marzo de 2026 (`2026-03-10`).
- [x] 3.5 Update `docs/data-model.md` `Session` if a field was added, and verify homework remains optional

  Class sessions are documented as `ClassSession`. The login `Session` model is unchanged. `homework` stays optional.

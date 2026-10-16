# Tasks

## 1. Branch

- [x] 1.1 Create and switch to `feature/us-13-consolidar-formato-mep` before any code change, and verify `git status` shows that branch

## 2. MEP document

- [x] 2.1 Write the failing Jest test that `MepDocument` is assembled from the snapshot, scenario competencies, and edited blocks, and that it uses the edited group observation. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed. Recorded failure: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — `assembles the document from the snapshot, scenario competencies, and the edited group observation` expected status 200 and received 404.
- [x] 2.2 Assemble `MepDocument` so the test from 2.1 passes. Run that same test and record the pass. Do not start this task until 2.1 is checked. Recorded pass: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — 1 passed.

- [x] 2.3 Write the failing test that an Editar campos patch persists, and that clearing a required field does not delete the document. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed. Recorded failure: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — `persists an Editar campos patch and keeps the document when a required field is cleared` expected status 200 and received 404.
- [x] 2.4 Persist Editar campos through a patch so the test from 2.3 passes. Run that same test and record the pass. Do not start this task until 2.3 is checked. Recorded pass: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — 2 passed.

- [x] 2.5 Write the failing component test that `MepStepPage` is a document view with three columns, the ready state, and Carlos's and María's signature sentences. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed. Recorded failure: `npx vitest run src/pages/steps/MepStepPage.test.tsx` — failed to resolve `./MepStepPage`.
- [x] 2.6 Build `MepStepPage` so the test from 2.5 passes. Run that same test and record the pass. Do not start this task until 2.5 is checked. Recorded pass: `npx vitest run src/pages/steps/MepStepPage.test.tsx` — 1 passed.

- [x] 2.7 Write the failing test that Continuar opens step 8 without setting `adjustmentApplied`, and that the flag stays false. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed. Recorded failure: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — `opens step 8 without applying an adjustment` expected status 200 and received 422.
- [x] 2.8 Implement that continue behavior so the test from 2.7 passes. Run that same test and record the pass. Do not start this task until 2.7 is checked. Recorded pass: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — 3 passed.

- [x] 2.9 Describe `MepDocument` in `docs/data-model.md`, and verify header fields match the screen

- [x] 2.10 Write the failing test that an edited `mediation-in-class` JSON becomes the activity names in the first strategy, and that the cell does not contain the raw JSON. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed. Recorded failure: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — `lists the activity names and does not store the raw JSON` expected the activity names and received the raw JSON array.
- [x] 2.11 Make the first strategy readable so the test from 2.10 passes. Run that same test and record the pass. Do not start this task until 2.10 is checked. Recorded pass: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — 4 passed.

- [x] 2.12 Write the failing test that an edited active-week session learning and an edited formative evidence card fill the first row, while the second row stays on the template. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed. Recorded failure: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — `uses the edited learning and the evidence card, and leaves the second row on the template` expected "aprendizaje editado en la sesión" and received "reconocer fracciones equivalentes".
- [x] 2.13 Fill the first row from those edited sources so the test from 2.12 passes. Run that same test and record the pass. Do not start this task until 2.12 is checked. Recorded pass: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` — 5 passed.

- [x] 2.14 Write the failing component test that Editar campos can save Curso lectivo as a number. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed. Recorded failure: `npx vitest run src/pages/steps/MepStepPage.test.tsx` — `saves Curso lectivo as a number` could not find a textbox named "Curso lectivo".
- [x] 2.15 Let Curso lectivo be edited so the test from 2.14 passes. Run that same test and record the pass. Do not start this task until 2.14 is checked. Recorded pass: `npx vitest run src/pages/steps/MepStepPage.test.tsx` — 2 passed.

- [x] 2.16 Write the component test that clearing Centro educativo and choosing Descargar PDF shows the field message, does not call download, and leaves the document on screen. Run it and record the result. Recorded pass on the first run: `npx vitest run src/pages/steps/MepStepPage.test.tsx` — `keeps the document on screen and does not download when a required field is empty` passed because the guard was already in the page. No production change in this task.

## 3. Mandatory verification

- [x] 3.1 Review document tests for at least two table rows, and verify they pass. This review does not replace the failing-test tasks above. Recorded pass: `npx jest --runInBand --forceExit tests/mepDocument.test.ts` expects two complete rows, including the second mathematics learning and indicator.
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-13-consolidar-formato-mep/specs/mep-document/reports/`
- [x] 3.3 Read the plan document with curl after an observation patch, and verify the new observation is stored. `GET` and `PATCH` returned 200, and the following `GET` stored "Observación corregida para la entrega."
- [x] 3.4 Run Playwright on step 7 and check the three column headings, and verify the page is usable at 1440px. `npx playwright test e2e/mep-step.spec.ts` — 1 passed. The document box stays inside 1440px.
- [x] 3.5 Update `docs/api-spec.yml` if document patch fields were added, and verify they are the fields Editar campos sends

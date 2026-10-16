# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-13-consolidar-formato-mep` before any code change, and verify `git status` shows that branch

## 2. MEP document

- [ ] 2.1 Write the failing Jest test that `MepDocument` is assembled from the snapshot, scenario competencies, and edited blocks, and that it uses the edited group observation. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.2 Assemble `MepDocument` so the test from 2.1 passes. Run that same test and record the pass. Do not start this task until 2.1 is checked.

- [ ] 2.3 Write the failing test that an Editar campos patch persists, and that clearing a required field does not delete the document. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.4 Persist Editar campos through a patch so the test from 2.3 passes. Run that same test and record the pass. Do not start this task until 2.3 is checked.

- [ ] 2.5 Write the failing component test that `MepStepPage` is a document view with three columns, the ready state, and Carlos's and María's signature sentences. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.6 Build `MepStepPage` so the test from 2.5 passes. Run that same test and record the pass. Do not start this task until 2.5 is checked.

- [ ] 2.7 Write the failing test that Continuar opens step 8 without setting `adjustmentApplied`, and that the flag stays false. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.8 Implement that continue behavior so the test from 2.7 passes. Run that same test and record the pass. Do not start this task until 2.7 is checked.

- [ ] 2.9 Describe `MepDocument` in `docs/data-model.md`, and verify header fields match the screen

## 3. Mandatory verification

- [ ] 3.1 Review document tests for at least two table rows, and verify they pass. This review does not replace the failing-test tasks above.
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-13-consolidar-formato-mep/specs/mep-document/reports/`
- [ ] 3.3 Read the plan document with curl after an observation patch, and verify the new observation is stored
- [ ] 3.4 Run Playwright on step 7 and check the three column headings, and verify the page is usable at 1440px
- [ ] 3.5 Update `docs/api-spec.yml` if document patch fields were added, and verify they are the fields Editar campos sends

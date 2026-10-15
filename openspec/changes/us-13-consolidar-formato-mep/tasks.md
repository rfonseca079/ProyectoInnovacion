# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-13-consolidar-formato-mep` before any code change, and verify `git status` shows that branch

## 2. MEP document

- [ ] 2.1 Assemble `MepDocument` from the snapshot, scenario competencies, and edited blocks, and verify a Jest test uses the edited group observation
- [ ] 2.2 Persist Editar campos through a patch, and verify a cleared required field does not delete the document
- [ ] 2.3 Build `MepStepPage` as a document view with three columns and the ready state, and verify Carlos's and María's signature sentences render
- [ ] 2.4 Continuar opens step 8 without setting `adjustmentApplied`, and verify that flag stays false
- [ ] 2.5 Describe `MepDocument` in `docs/data-model.md`, and verify header fields match the screen

## 3. Mandatory verification

- [ ] 3.1 Review document tests for at least two table rows, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-13-consolidar-formato-mep/specs/mep-document/reports/`
- [ ] 3.3 Read the plan document with curl after an observation patch, and verify the new observation is stored
- [ ] 3.4 Run Playwright on step 7 and check the three column headings, and verify the page is usable at 1440px
- [ ] 3.5 Update `docs/api-spec.yml` if document patch fields were added, and verify they are the fields Editar campos sends

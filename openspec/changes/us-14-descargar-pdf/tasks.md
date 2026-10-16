# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-14-descargar-pdf` before any code change, and verify `git status` shows that branch

## 2. PDF

- [ ] 2.1 Write the failing text-extraction test that the institutional PDF is rendered from saved document rows and contains an edited observation, not the previous sentence. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.2 Render the institutional PDF from saved document rows so the test from 2.1 passes. Run that same test and record the pass. Do not start this task until 2.1 is checked.

- [ ] 2.3 Write the failing Jest cases that return 422 with no file when a required field is empty, and 404 for another teacher. Run them and record the command, each test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after those failures have been observed.
- [ ] 2.4 Implement those 422 and 404 responses so the tests from 2.3 pass. Run those same tests and record the pass. Do not start this task until 2.3 is checked.

- [ ] 2.5 Write the failing test that Juanita's file is named `planeamiento-matematica-4-marzo-2026.pdf` and that the content-disposition header carries that name. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.6 Implement that filename so the test from 2.5 passes. Run that same test and record the pass. Do not start this task until 2.5 is checked.

- [ ] 2.7 Write the failing test that the week PDF is rendered from the five sessions only and does not include the institutional header sentence used on the full document. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.8 Render the week PDF so the test from 2.7 passes. Run that same test and record the pass. Do not start this task until 2.7 is checked.

- [ ] 2.9 Write the failing component test that preview and download on `MepStepPage` use the same request and that the preview component receives that response. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [ ] 2.10 Add preview and download on `MepStepPage` so the test from 2.9 passes. Run that same test and record the pass. Do not start this task until 2.9 is checked.

- [ ] 2.11 Document both GET routes in `docs/api-spec.yml`, and verify the binary response type is `application/pdf`

## 3. Mandatory verification

- [ ] 3.1 Review PDF tests for Carlos's and María's signature sentences, and verify they pass. This review does not replace the failing-test tasks above.
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-14-descargar-pdf/specs/pdf-download/reports/`
- [ ] 3.3 Download Juanita's PDF with curl and verify the filename and a 200 status
- [ ] 3.4 Run Playwright that edits an observation and downloads, and verify the browser receives a PDF
- [ ] 3.5 Update `docs/development_guide.md` with the chosen PDF library only if one was added, and verify no language-model package was added

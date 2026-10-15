# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-14-descargar-pdf` before any code change, and verify `git status` shows that branch

## 2. PDF

- [ ] 2.1 Render the institutional PDF from saved document rows, and verify a text extraction test contains an edited observation and not the previous sentence
- [ ] 2.2 Return 422 with no file when a required field is empty, and 404 for another teacher, and verify both Jest cases
- [ ] 2.3 Name Juanita's file `planeamiento-matematica-4-marzo-2026.pdf`, and verify the content-disposition header
- [ ] 2.4 Render the week PDF from the five sessions only, and verify it does not include the institutional header sentence used on the full document
- [ ] 2.5 Add preview and download on `MepStepPage` using the same request, and verify the preview component receives that response
- [ ] 2.6 Document both GET routes in `docs/api-spec.yml`, and verify the binary response type is `application/pdf`

## 3. Mandatory verification

- [ ] 3.1 Review PDF tests for Carlos's and María's signature sentences, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-14-descargar-pdf/specs/pdf-download/reports/`
- [ ] 3.3 Download Juanita's PDF with curl and verify the filename and a 200 status
- [ ] 3.4 Run Playwright that edits an observation and downloads, and verify the browser receives a PDF
- [ ] 3.5 Update `docs/development_guide.md` with the chosen PDF library only if one was added, and verify no language-model package was added

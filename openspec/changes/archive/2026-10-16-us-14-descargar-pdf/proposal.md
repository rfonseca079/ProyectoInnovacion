# Proposal

## Why

The teacher delivers a file, not only an on-screen document. US-14 requires that preview and download use the saved MEP document, and that the week export stay a separate file.

## What Changes

- Add Vista previa PDF using the same generated content as the download.
- Generate the institutional PDF from the saved document, including later field edits.
- Name the file `planeamiento-{subject}-{grade}-{month}-{schoolYear}.pdf` without accents.
- Refuse the download with a field message when a required document field is empty.
- Generate a week PDF that contains only that week's five sessions.
- Deny a download of another teacher's plan.

## Capabilities

### New Capabilities

- `pdf-download`: Server-generated institutional PDF and week PDF from saved rows.

### Modified Capabilities

- None.

## Impact

- `GET /api/plans/{planId}/document/pdf` and `GET /api/plans/{planId}/weeks/{weekNumber}/pdf`.
- `renderPlanPdf.ts`, `renderWeekPdf.ts`, and `documentController.ts`.
- Buttons on `MepStepPage.tsx` and `SessionsStepPage.tsx`.
- No static sample PDF and no language-model rendering.

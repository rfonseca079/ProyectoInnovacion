# Proposal

## Why

Step 7 is the institutional document, not another loose form. It must assemble the decisions already saved, let the teacher correct fields, and keep those corrections as the source of the later PDF.

## What Changes

- Build the MEP document from the plan snapshot and the scenario template the first time step 7 opens.
- Prefer edited plan blocks over the scenario base text.
- Show the institutional header, general competencies, a three-column table with at least two rows, instruments, and observations.
- Show the ready-for-delivery state.
- Let Editar campos change header, cells, and observations, and autosave them.
- Keep Descargar PDF blocked while a required document field is empty, without hiding the document.
- Continuar opens step 8 with the adjustment still unapplied.

## Capabilities

### New Capabilities

- `mep-document`: Consolidated institutional document assembled from saved plan data.

### Modified Capabilities

- None.

## Impact

- `MepDocument` persistence and `backend/src/application/buildMepDocument.ts`.
- `frontend/src/pages/steps/MepStepPage.tsx`.
- PDF download itself belongs to US-14.
- No language-model drafting of the template.

# Proposal

## Why

Step 3 records how the class arrives so later mediation and evidence screens can show texts already tied to that scenario. The demo must not invent a diagnosis or collect sensitive student records.

## What Changes

- Add the six required group fields: prior knowledge, difficulties, resources, pace, supports, and teacher notes.
- Block Continuar while any of those fields is empty.
- Keep supports as general classroom help. Do not add a formal accommodation section or student identifiers.
- Generate three stored implication cards together, and let each card regenerate on its own.
- Mark step 4 visited the first time the teacher continues successfully.

## Capabilities

### New Capabilities

- `group-diagnosis`: Group profile form and stored pedagogical implication cards.

### Modified Capabilities

- None.

## Impact

- Blocks `prior-knowledge`, `difficulties`, `resources`, `pace`, `supports`, `teacher-notes`, and the three implication keys.
- `POST /api/plans/{planId}/actions/generate-implications`.
- `frontend/src/pages/steps/GroupStepPage.tsx`.
- No student-level personal data.

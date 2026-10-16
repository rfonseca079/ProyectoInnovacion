# Proposal

## Why

Step 6 turns the active week into five class sessions, each with a start, development, and close. The teacher also needs a stored alternate set, a way to copy one session's structure, and a week-only PDF.

## What Changes

- Show the month's stored weeks, with the scenario's active week selected.
- List five sessions. For mathematics week 2, Monday and Wednesday start expanded.
- Edit session fields with autosave.
- Replace all five sessions with the next stored set and mark them suggested.
- Copy structure from the first expanded session, keeping each session's day, date, and expected learning.
- Download a PDF of the five saved sessions only.
- On a valid continue, open step 7 and set the plan to ready for delivery.

## Capabilities

### New Capabilities

- `week-sessions`: Week selector, five daily sessions, generation, structure copy, and week export.

### Modified Capabilities

- None.

## Impact

- `Week` and `ClassSession` rows, including `expanded`. The login `Session` stays the sign-in cookie.
- Actions `generate-week-sessions` and `duplicate-structure` (409 when no session is expanded).
- `GET /api/plans/{planId}/weeks/{weekNumber}/pdf`.
- `frontend/src/pages/steps/SessionsStepPage.tsx`.
- Continuing from step 6 sets `status` to `READY_FOR_DELIVERY`.

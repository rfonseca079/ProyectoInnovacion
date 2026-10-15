# Proposal

## Why

Step 1 is where the teacher checks the official program extract, the usable lessons, and the stored month calendar before the rest of the plan is built. Those texts and holiday marks already exist in the scenario; the screen must not invent them.

## What Changes

- Show the program extract, available time, restrictions, and month calendar from the plan's scenario.
- Cycle Reanalizar programa through the three stored extract variants.
- Let the teacher edit available time and restrictions, with autosave.
- Show three suggestion cards: month objectives, contents that fit, and calendar risks, each with accept, edit, and regenerate.
- Render calendar kinds from stored days. Do not calculate Costa Rican holidays at runtime.
- Block Continuar until the extract, lesson totals, and three cards have text.

## Capabilities

### New Capabilities

- `program-and-calendar`: Step 1 review of the stored program extract, time, and calendar.

### Modified Capabilities

- None.

## Impact

- Blocks `program-extract`, `available-time`, `calendar-restrictions`, `month-objectives`, `month-contents`, and `calendar-risks`.
- `POST /api/plans/{planId}/actions/reanalyze-program` and block regenerate routes.
- `frontend/src/pages/steps/ProgramStepPage.tsx` and scenario seed rows.
- `CalendarDay` kinds `TEACHING`, `HOLIDAY`, `SUSPENDED`, and `ASSESSMENT`.

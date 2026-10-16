# Proposal

## Why

Step 5 combines checks during class with the evaluations already scheduled for the month. Balancing that load must move dates and instruments that match the current rubric names, not rewrite the rubric itself.

## What Changes

- Show formative evidence on the left and scheduled evidence on the right.
- Store what each piece measures, when, the instrument, and the linked expected learning.
- Accept, edit, and regenerate each card.
- Replace the scheduled set with the next stored load whose rubric names still match.
- Warn when a scheduled date falls on a stored holiday or suspended day, without blocking Continuar for that warning.
- Require at least one complete formative card and one complete scheduled card before Continuar.

## Capabilities

### New Capabilities

- `learning-evidence`: Formative and scheduled evidence cards, plus stored load balancing.

### Modified Capabilities

- None.

## Impact

- `Evidence` rows with `kind` `FORMATIVE` or `SCHEDULED`.
- `POST /api/plans/{planId}/actions/balance-assessment-load`, returning 409 when no stored load matches current rubric names.
- `frontend/src/pages/steps/EvidenceStepPage.tsx`.
- Date warning reads `CalendarDay`; it does not send a notification.

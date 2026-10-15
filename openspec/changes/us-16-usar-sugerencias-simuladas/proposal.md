# Proposal

## Why

Every screen that looks like AI help must behave the same way: read a stored variant, let the teacher accept or edit it, and never call a language model. US-16 is that shared contract, including scenario matching and the fallback to the March mathematics pack.

## What Changes

- On the first visit to a step, fill its blocks from variant 1 and mark them suggested.
- Accept keeps the visible text and marks the card accepted.
- Edit saves the teacher's text and marks the card edited.
- Regenerate cycles variants 1, 2, and 3. It replaces visible text only while the card is still suggested.
- Named actions replace visible text even after accept or edit, then mark the affected cards suggested again.
- Match a scenario by year, subject, grade, and month. Otherwise use `mat-4-marzo-2026` and show the Spanish fallback notice.
- When that key changes, reload only blocks that are still suggested.
- Return a clear message when no further stored suggestion exists.

## Capabilities

### New Capabilities

- `simulated-suggestions`: Shared accept, edit, regenerate, named-action, and scenario-fallback behavior.

### Modified Capabilities

- None.

## Impact

- Block routes for accept, edit, and regenerate, plus `POST /api/plans/{planId}/actions/{actionKey}`.
- `SuggestionCard.tsx`, `suggestionService.ts`, and the suggestion application services.
- `SuggestionVariant` rows in Prisma, three variants for every regenerable block.
- A review check that application code does not import a language-model SDK.
- No side chat panel.

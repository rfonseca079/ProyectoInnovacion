# Design

## Context

See proposal.md. This is the shared suggestion mechanism. Step changes call it; they do not each invent a variant cycle.

## Goals / Non-Goals

**Goals:**

- One block status machine: `SUGGESTED`, `ACCEPTED`, `EDITED`.
- Scenario lookup with a single fallback pack.
- A hard ban on language-model clients.

**Non-Goals:**

- A chat panel, streaming tokens, or generating text when a variant is missing.

## Decisions

- First visit to a step inserts `PlanBlock` rows from variant 1, status `SUGGESTED`, and saves them.
- Accept sets `ACCEPTED` and keeps the visible body. Edit sets `EDITED` and stores the submitted body.
- Regenerate cycles `variant` through 1, 2, 3. It replaces `body` only while status is `SUGGESTED`.
- Named actions replace `body` regardless of status and set status back to `SUGGESTED`. Unknown or exhausted actions return 404 with the Spanish sentence.
- Scenario key is `schoolYear`, `subject`, `gradeLevel`, and `month`. No row sets `scenarioId` to `mat-4-marzo-2026` and `usedFallback` to true. A key change reloads only `SUGGESTED` blocks.
- Add a test that fails if application code imports a known language-model SDK.

Alternative considered: copying suggested text into a second column on accept. Rejected because the visible body is already the draft, and accept only changes status.

## Risks / Trade-offs

- [Named actions discard an edit] → Required by the spec. The previous body is not versioned in this demo.

## Migration Plan

Create `SuggestionVariant` with three rows for every regenerable block in the three scenarios. Rollback drops the table after step screens stop reading it.

## Open Questions

None.

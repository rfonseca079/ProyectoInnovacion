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
- Accept sets `ACCEPTED` and keeps the visible body. Edit sets `EDITED` and stores the submitted body. A regenerate on an accepted or edited block stores the next variant as `variant + 3` and leaves `body` unchanged. Accept while that offset is set writes the stored text and returns the variant to 1, 2, or 3. An edit clears the offset. A blur that does not change the text does not save.
- The card shows `Sugerido por IA`, `Aceptada`, or `Editada` from the block status.
- Regenerate cycles `variant` through 1, 2, 3. It replaces `body` only while status is `SUGGESTED`.
- Every week gets a `PlanBlock` for `week-sessions-{position}` from variant 1, so Generar las 5 sesiones can load the next stored set for a week that is not active.
- Regenerar and named actions show `No hay otra sugerencia guardada para este bloque.` on the step when no further text is stored.
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

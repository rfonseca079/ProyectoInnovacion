# Design

## Context

See proposal.md. Several later actions also persist a plan. This change defines the partial save used by field edits and the footer.

## Goals / Non-Goals

**Goals:**

- Persist a partial plan update and bump `updatedAt`.
- Show success or the exact failure sentence without clearing the form.

**Non-Goals:**

- A separate Guardar button, offline queues, or conflict merge between two browsers.

## Decisions

- `PATCH /api/plans/:planId` accepts the changed fragment and rejects another teacher's id with 404.
- The client saves on blur and on the triggers listed in the spec. Actions that already return a saved plan do not send a second patch.
- A network or HTTP failure sets the footer to "No se pudo guardar el borrador. Intente de nuevo." and leaves local field state as typed.
- Reopen uses `currentStep` and stored blocks from `GET /api/plans/:planId`.

Alternative considered: debounced saves on every keystroke. Rejected in favor of blur, which matches US-05 and avoids a write per character.

## Risks / Trade-offs

- [User closes the tab before blur] → The last successful save remains. The footer cannot claim a save that did not finish.

## Migration Plan

No new table if `Plan` and `PlanBlock` already exist. Rollback removes the patch handler.

## Open Questions

None.

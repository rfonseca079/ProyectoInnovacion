# Design

## Context

See proposal.md. The document is assembled once from saved blocks and then edited as its own record. Download stays in US-14.

## Goals / Non-Goals

**Goals:**

- Build `MepDocument` from the plan snapshot and scenario template.
- Prefer edited blocks over base text, then let Editar campos overwrite the document itself.

**Non-Goals:**

- PDF bytes, post-class rewrite, and a second form layout.

## Decisions

- On first open of step 7, if no `MepDocument` exists, build it from header snapshot, scenario competencies, at least two table rows, step 5 instruments, and step 3 observations.
- Where a relevant block was edited, use that body instead of the scenario base.
- Editar campos patches the document fields and autosaves. Those fields are what a later PDF reads.
- Empty required fields block download with a field message and leave the view in place. They do not delete the document.
- Continuar opens step 8 and does not set `adjustmentApplied`.

Alternative considered: rebuilding the document on every view from the blocks. Rejected because Editar campos must be able to diverge from the earlier steps until an adjustment explicitly rewrites rows.

## Risks / Trade-offs

- [Document can drift from earlier steps after a manual edit] → That is the point of Editar campos. US-15 is the path that writes adjustment text back into the document.

## Migration Plan

Add `MepDocument`. Rollback deletes those rows and the step 7 page.

## Open Questions

None.

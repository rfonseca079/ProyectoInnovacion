# Design

## Context

See proposal.md. Calendar marks and program text are `SuggestionVariant` and `CalendarDay` rows for the plan's scenario.

## Goals / Non-Goals

**Goals:**

- Render step 1 from stored blocks and calendar days.
- Cycle the program extract independently from the three cards.

**Non-Goals:**

- A holiday calculation library, or editing the calendar marks themselves.

## Decisions

- Block keys: `program-extract`, `available-time`, `calendar-restrictions`, `month-objectives`, `month-contents`, `calendar-risks`.
- Reanalizar programa calls the named action `reanalyze-program`, which replaces `program-extract` and sets it back to `SUGGESTED`.
- Card Regenerar uses the shared regenerate route and stays inside that block key. A suggested card shows the next stored text. An edited card keeps the teacher's text until accept.
- A calendar cell shows Lectivo, Feriado, Suspendido, or Evaluación only when that day has a stored mark. Editar focuses the card text.
- Time and restriction edits use the autosave patch.
- Continue checks those fields are non-empty before step 2.

Alternative considered: one JSON document for the whole step. Rejected so each card can regenerate without rewriting the calendar.

## Risks / Trade-offs

- [Variant 2 and 3 copy is easy to leave as a placeholder] → Seed assertions must look for the distinctive sentences in US-07.

## Migration Plan

Seed calendar days and three variants per card for all three scenarios. Rollback deletes those rows.

## Open Questions

None.

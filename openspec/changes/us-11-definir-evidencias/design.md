# Design

## Context

See proposal.md. Scheduled evidence must stay tied to current rubric names, and holiday warnings read `CalendarDay` from US-07.

## Goals / Non-Goals

**Goals:**

- Two columns of evidence cards with four fields each.
- A stored rebalance that refuses when rubric names no longer match.

**Non-Goals:**

- Sending the non-teaching-day warning anywhere, or changing rubric percentages except for the explicitly seeded third load when names still match.

## Decisions

- `Evidence.kind` is `FORMATIVE` or `SCHEDULED`. Cards use the shared accept, edit, and regenerate routes.
- `balance-assessment-load` selects the next stored set whose `rubricNames` equal the current rubric names. No match returns 409 and the Spanish sentence from the spec.
- A scheduled `when` that falls on `HOLIDAY` or `SUSPENDED` is a display warning only. Continue checks completeness, not the warning.
- The third mathematics load may move quiz weight only when the seeded rubric names are unchanged. That write is stored data, not a general redistributor.

Alternative considered: always moving dates even after renames. Rejected because US-11 says unmatched names produce the 409 message.

## Risks / Trade-offs

- [Date strings can miss the calendar day] → Seed dates are concrete `YYYY-MM-DD` values compared to `CalendarDay`, not parsed from Spanish prose at runtime.

## Migration Plan

Seed three loads per scenario. Rollback removes the action and evidence rows.

## Open Questions

None.

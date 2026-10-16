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
- `balance-assessment-load` selects the next stored set whose `rubricNames` are the same set as the current rubric names. Position does not matter. No match returns 409 and the Spanish sentence from the spec.
- A lost claim returns the plan without applying another load. The balance control ignores further clicks while a request is in flight.
- A scheduled `occursOn` that falls on `HOLIDAY` or `SUSPENDED` is a display warning only. A missing `occursOn` does not warn, even when the Spanish `when` names a week that contains a holiday. Continue checks completeness, not the warning.
- Only the third mathematics load may move quiz weight, and only when the seeded rubric names are unchanged. Other loads replace scheduled evidence and leave rubric count and percentage untouched.

Alternative considered: always moving dates even after renames. Rejected because US-11 says unmatched names produce the 409 message.

## Risks / Trade-offs

- [Date strings can miss the calendar day] → Seed dates are concrete `YYYY-MM-DD` values compared to `CalendarDay`, not parsed from Spanish prose at runtime.

## Migration Plan

Seed three loads per scenario. Rollback removes the action and evidence rows.

## Open Questions

None.

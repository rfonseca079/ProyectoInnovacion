# Design

## Context

See proposal.md. Week PDF generation is specified here and implemented with the same renderer rules as US-14. This change owns the session behavior and the week download request.

## Goals / Non-Goals

**Goals:**

- Five stored sessions per week, with generation, structure copy, and a week PDF.
- Mark the plan ready for delivery when step 7 opens from a valid step 6.

**Non-Goals:**

- The institutional MEP document (US-13) and applying post-class adjustments (US-15).

## Decisions

- `ClassSession` rows hold the fields in the spec, plus `expanded`. They are not the login `Session`. Mathematics week 2 seeds Monday and Wednesday expanded. Date and the 40-minute duration are shown. A date outside that week's stored range is rejected.
- `generate-week-sessions` replaces the five sessions of the active week and sets them to `SUGGESTED`. Another selected week has no next set: the sessions stay and the response is 409 with "Esta semana no tiene otro conjunto guardado." The generate control is enabled only for the active week.
- `duplicate-structure` copies start, development, close, materials, and formative evidence from the first expanded session. It returns 409 and the Spanish sentence when none is expanded. Day, date, and expected learning stay.
- `GET /api/plans/:planId/weeks/:weekNumber/pdf` renders only those sessions. Offsets and stream length use the bytes written to the file. Lines wrap to the page width. Export waits for a save already in flight. The filename pattern is in the spec.
- Successful continue from step 6 sets `status` to `READY_FOR_DELIVERY` and opens step 7.

Alternative considered: building the week PDF in the browser. Rejected so both downloads come from saved rows on the server.

## Risks / Trade-offs

- [US-14 may land before or after this change] → Share one PDF helper, but do not block session behavior on the institutional template.

## Migration Plan

Seed weeks 1–4 and three sets for each active week. Rollback removes sessions and the week route.

## Open Questions

None.

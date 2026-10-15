# Design

## Context

See proposal.md. Implication cards are stored sets. Generating them does not read the free-text profile to produce new sentences.

## Goals / Non-Goals

**Goals:**

- Require the six profile fields.
- Replace the three implication cards as one set, while still allowing one card to regenerate.

**Non-Goals:**

- Formal accommodations, student names, or a model that rewrites implications from the profile.

## Decisions

- Block keys: `prior-knowledge`, `difficulties`, `resources`, `pace`, `supports`, `teacher-notes`, `implication-manipulatives`, `implication-scaffolding`, `implication-differentiation`.
- `generate-implications` advances a set index and writes all three cards as `SUGGESTED`.
- Regenerar on one card uses the shared per-block cycle.
- Continue returns 422 naming the empty field. Success sets `highestVisitedStep` to at least 4.

Alternative considered: hiding implication cards until the button is pressed. Rejected because the first visit already shows variant 1, and the button moves to the next set.

## Risks / Trade-offs

- [Profile text and implication text can disagree] → Accepted. The demo does not derive one from the other.

## Migration Plan

Seed three implication sets per scenario. Rollback removes the action.

## Open Questions

None.

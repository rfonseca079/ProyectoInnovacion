# Design

## Context

See proposal.md. Juanita's seed opens on this step, so the mathematics week 2 rows must exist before first run.

## Goals / Non-Goals

**Goals:**

- Edit in-class and out-of-class rows.
- Provide three independent stored cycles, including one whose minutes sum to 40.

**Non-Goals:**

- Requiring a 40-minute total to continue, or recomputing times in code.

## Decisions

- Store in-class rows as JSON on `mediation-in-class` and out-of-class items on `mediation-outside`.
- Actions `regenerate-mediation`, `fit-40-minutes`, and `simplify-materials` each have their own variant list. `regenerate-mediation` overwrites both mediation blocks and sets them to `SUGGESTED`. `fit-40-minutes` and `simplify-materials` overwrite the in-class table and set that block to `SUGGESTED`.
- A field save already in flight finishes before the action request, and its later screen update must not put the pre-action text back.
- Two overlapping calls claim the next stored set once. The first call may create the cursor; a lost create retries.
- The 40-minute variant is data: 8, 14, 12, and 6. The domain does not scale the previous times. The fourth call from the initial cursor returns to that set.
- Continue checks that at least one row exists and every row has `minutes`.

Alternative considered: one action parameter for "mode". Rejected so each button maps to the action key already named in `docs/api-spec.yml`.

## Risks / Trade-offs

- [Three buttons can overwrite an accepted mediation] → That replacement is required by US-16 for named actions. Accept can be used again afterward.

## Migration Plan

Seed the initial table, the 40-minute variant, the simplified materials, and two further full mediations. Rollback removes those variants.

## Open Questions

None.

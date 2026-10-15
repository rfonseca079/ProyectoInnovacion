# Data Model

Relational model for Planificador AI. PostgreSQL is the source of truth, accessed through Prisma. Product rules come from `UserStories/`.

Identifiers below are English. Teacher-facing values stored as content stay in Spanish.

## Teacher

A seeded account. There is no registration table and no password-reset token.

| Field | Notes |
| --- | --- |
| `id` | Primary key |
| `fullName` | Display name |
| `email` | Unique login |
| `passwordHash` | Hash only. Never return it from the API |
| `schoolName` | Default school copied into a new plan |
| `regionalDirectorate` | Default regional directorate copied into a new plan |

Seeded teachers: Juanita Pérez, Carlos Mora, and María Solís. Details and the demo password are in `docs/development_guide.md`.

## Session

Server session created at login. The browser only stores the session id in the cookie `planificador_session`. That cookie is `httpOnly`, has no `Max-Age`, and ends when the browser closes.

| Field | Notes |
| --- | --- |
| `id` | Primary key. This is the cookie value |
| `teacherId` | Foreign key to `Teacher` |
| `createdAt` | When the teacher signed in |

## Plan

One didactic plan owned by one teacher. A teacher sees only their own plans.

| Field | Notes |
| --- | --- |
| `id` | Primary key |
| `teacherId` | Foreign key to `Teacher` |
| `cycle` | `I_II`, `III`, or `DIVERSIFIED` |
| `gradeLevel` | `1` through `11`, constrained by cycle |
| `subject` | `MATH`, `SPANISH`, `SCIENCE`, or `SOCIAL_STUDIES` |
| `modality` | `IN_PERSON`, `VIRTUAL`, or `HYBRID` |
| `schoolYear` | Integer. Seed scenarios use `2026` |
| `month` | `1` through `12` |
| `schoolName`, `regionalDirectorate`, `teacherName` | Snapshot for this plan. Editable |
| `section` | Group name, such as `4.° A` |
| `studentCount`, `weeklyLessons` | Integers greater than zero |
| `status` | `DRAFT`, `READY_FOR_DELIVERY`, or `ADJUSTED` |
| `currentStep` | Last saved step, `0` through `8` |
| `highestVisitedStep` | Highest step the teacher has opened |
| `scenarioId` | Scenario selected for suggestions |
| `usedFallback` | True when the configuration did not match a scenario and `mat-4-marzo-2026` was used |
| `notifyEvaluationChanges` | Boolean, default false. Stored only. Nothing is sent |
| `updatedAt` | Shown on the plan list |

Seeded list dates, stored at noon Costa Rica time: Juanita 10 March 2026, Carlos 2 April 2026, María 18 February 2026.

Status changes:

- A new plan starts as `DRAFT`.
- Entering step 7 with valid data sets `READY_FOR_DELIVERY`.
- Applying the post-class adjustment sets `ADJUSTED`.

## Scenario

A stored content pack. Matching key: `schoolYear` + `subject` + `gradeLevel` + `month`. Modality, school, and group do not change the scenario.

| Id | Match |
| --- | --- |
| `mat-4-marzo-2026` | 2026, Mathematics, grade 4, March. Also the fallback pack |
| `esp-2-abril-2026` | 2026, Spanish, grade 2, April |
| `cie-7-febrero-2026` | 2026, Science, grade 7, February |

If nothing matches, the plan stores `scenarioId = mat-4-marzo-2026` and `usedFallback = true`.

Changing year, subject, grade, or month selects the scenario again. Blocks still marked `SUGGESTED` reload variant 1 of the new scenario. `ACCEPTED` and `EDITED` blocks keep their text.

## SuggestionVariant

One stored text or JSON payload for a block.

| Field | Notes |
| --- | --- |
| `scenarioId` | Foreign key |
| `blockKey` | Stable key, such as `program-extract` or `month-objectives` |
| `variant` | `1`, `2`, or `3` |
| `actionKey` | Optional. Set when a named button loads this variant, such as `fit-40-minutes` |
| `body` | Text or structured JSON |

Every regenerable block has three variants. Named buttons (`reanalyze-program`, `redistribute-evaluation`, `generate-implications`, `regenerate-mediation`, `fit-40-minutes`, `simplify-materials`, `balance-assessment-load`, `generate-week-sessions`) select the next stored variant for that action and replace the visible text, even if the block was accepted or edited. The block returns to `SUGGESTED`.

`Regenerate` on a card cycles variants 1, 2, and 3. If the block is still `SUGGESTED`, the visible field updates too. If it is `ACCEPTED` or `EDITED`, the field stays until the teacher accepts the new variant.

## PlanBlock

The teacher's current content for one block.

| Field | Notes |
| --- | --- |
| `planId`, `blockKey` | Unique together |
| `status` | `SUGGESTED`, `ACCEPTED`, or `EDITED` |
| `variant` | Variant currently shown |
| `body` | Current saved content |

Step 1 block keys, matching the seed: `program-extract`, `available-time`, `calendar-restrictions`, `month-objectives`, `month-contents`, and `calendar-risks`. `available-time` stores JSON with `plannableLessons` and `affectedLessons`. The other five store Spanish text.

The first visit to a step creates these rows from variant 1 and saves them as the draft.

## Week and Session

Step 2 stores four `Week` rows on the plan, with `position` and `title`. Each scenario stores the weeks of its month. The active week has five sessions, Monday to Friday. Each session stores day, date, expected learning, 40-minute duration, start, development, close, materials, formative evidence, and optional homework.

Scenario A week 2 is 9–13 March 2026. Monday and Wednesday start expanded. Thursday includes the stored plan B.

`duplicate-structure` copies start, development, close, materials, and formative evidence from the expanded session onto the other sessions of that week. It keeps each session's day, date, and expected learning.

## CalendarDay

Stored marks for the month. Kinds: `TEACHING`, `HOLIDAY`, `SUSPENDED`, `ASSESSMENT`. The app does not calculate Costa Rican holidays at runtime.

For `mat-4-marzo-2026`: 6 March suspended (teachers' council), 13 and 27 March assessment, 30 and 31 March holiday. A day without a stored row is shown without a kind label.

`esp-2-abril-2026` stores 6 April 2026 as a teaching day. `cie-7-febrero-2026` stores 6 February 2026 as a teaching day. Those rows are stored marks, not a holiday calculation.

## Group profile

Step 3 stores six required blocks: `prior-knowledge`, `difficulties`, `resources`, `pace`, `supports`, and `teacher-notes`. Continue names the first empty field, for example "Complete el campo Observaciones de la docente." Supports stay general classroom help. The step does not store a formal accommodation section or student identifiers.

The implication cards are `implication-manipulatives`, `implication-scaffolding`, and `implication-differentiation`. `generate-implications` writes the next stored set into all three and marks them `SUGGESTED`. It claims the current set before writing, so two overlapping calls do not apply the same set twice. Regenerating one card cycles only that key. Saving one profile field does not replace unsaved text in the other fields. The mathematics set 2 includes "Iniciar la recta numérica solo después de la representación concreta." The science set 1 includes "Observar células en láminas o imágenes antes de copiar el esquema."

## Mediation

Step 4 stores the active week's in-class rows on `mediation-in-class` and the out-of-class tasks on `mediation-outside`. An in-class row is JSON with `activity`, `teacherRole`, `studentRole`, `minutes`, and `materials`. An out-of-class item is JSON with `task`, `purpose`, and `estimatedDuration`. Mathematics week 2 starts at 10, 25, 20, and 5 minutes. `fit-40-minutes` variant 1 is 8, 14, 12, and 6. `simplify-materials` variant 1 uses paper and pencil, a notebook, and the board. `regenerate-mediation` cycles the full in-class and out-of-class sets together. `fit-40-minutes` and `simplify-materials` replace only the in-class table. A field save already in flight finishes before those actions and must not put the previous table back. Two overlapping calls claim the next stored set once. The fourth call from the initial cursor returns to variant 1. Continuar requires at least one in-class row and a time on every row. The times do not have to sum to 40.

## RubricItem

Rows of the evaluation table, stored as `position`, `name`, `count`, and `percentage`. Each percentage is an integer from 0 through 100. A value outside that range is rejected with "Cada porcentaje debe ser un entero entre 0 y 100." and the stored rows stay. The stored distributions for the initial five mathematics rows already sum to 100. `add-item` inserts a row at 0. `remove-item` cannot delete the last row. Continue on step 2 is allowed only when the percentages sum to 100, every percentage is inside that range, and every row and week has a name.

`redistribute-evaluation` writes the next stored percentage vector with the same row count and leaves names unchanged. It claims the current variant before writing, so two overlapping calls do not apply the same vector twice. If none matches, the response is 409 with "No hay una distribución guardada para esta cantidad de rubros."

Mathematics variant 1 is 30, 20, 15, 20, 15. Variant 2 is 25, 15, 20, 25, 15. Variant 3 is 20, 20, 10, 30, 20. Spanish and science each store three distributions for their own four-row rubrics. Those rows are stored content for the demo, not a calculated split.

## Evidence

Formative and scheduled evidence cards: what it measures, when, instrument, and link to an expected learning. `balance-assessment-load` loads the next stored set that matches the current rubric names. If none matches, the API returns that no stored load exists.

## AdjustmentSet

Stored result of **Aplicar ajustes**, keyed by scenario as `ajuste-semana` in the stories and `adjustment-week` in the schema.

Applying it writes the stored texts into that week's sessions and into the MEP document rows. Edited adjustment cards replace the base text. Applying again replaces those fields; it does not insert duplicate rows.

## MepDocument

Consolidated view built from the plan snapshot plus scenario template rows. `edit-fields` updates the stored header, table cells, and observations. PDF generation reads this saved document. Required document fields must be non-empty before download.

## Relationships

- `Teacher` 1—N `Session`
- `Teacher` 1—N `Plan`
- `Scenario` 1—N `SuggestionVariant`
- `Plan` N—1 `Scenario`
- `Plan` 1—N `PlanBlock`, `RubricItem`, `Week`, `Evidence`
- `Week` 1—N `Session`
- `Plan` 1—1 `MepDocument`
- `Plan` 1—1 adjustment state (applied or not, plus the teacher log)

## Access rule

Every query for a plan, PDF, or suggestion is scoped by the authenticated `teacherId`. A request for another teacher's id returns no data.

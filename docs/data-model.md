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

Step 2 stores four `Week` rows on the plan, with `position`, `title`, and `active`. Each scenario stores the weeks of its month. The active week is selected when step 6 opens. Mathematics uses week 2. Spanish and science use week 1.

Class sessions are `ClassSession` rows. They are not the login `Session` above. Each week stores five class sessions, Monday to Friday. Homework is optional and stays null when the day has no assignment.

| Field | Notes |
| --- | --- |
| `planId`, `weekPosition`, `position` | Unique together. `position` 1 is Monday |
| `day` | Spanish day name |
| `occursOn` | Calendar date. Shown, not edited in the step. A value outside that week's stored range is rejected with "La fecha debe quedar dentro de esta semana." |
| `expectedLearning` | Required to continue |
| `durationMinutes` | 40 in the seed |
| `start`, `development`, `close` | Required to continue |
| `materials` | Stored text |
| `formativeEvidence` | The day's formative evidence |
| `homework` | Optional. Null when the session has no assignment |
| `expanded` | Monday and Wednesday of mathematics week 2 start true |
| `status` | `SUGGESTED`, `ACCEPTED`, or `EDITED` |
| `planBNote`, `planBMinutes` | Optional. Thursday of mathematics week 2 stores the institutional note and 25 minutes |

Scenario A week 2 is 9–13 March 2026. Monday and Wednesday start expanded. Thursday includes the stored plan B.

`generate-week-sessions` replaces the five sessions of the selected week with the next stored set and marks them `SUGGESTED`. `duplicate-structure` copies start, development, close, materials, and formative evidence from the first expanded session onto the other sessions of that week. It keeps each session's day, date, and expected learning. If none is expanded, the response is 409 with "Abra una sesión para duplicar su estructura."

A valid continue from step 6 opens step 7 and sets the plan to `READY_FOR_DELIVERY`.

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

Step 5 stores formative and scheduled cards. `kind` is only `FORMATIVE` or `SCHEDULED`. Each row stores `title`, `measures`, `when`, `instrument`, `expectedLearning`, and optional `occursOn` (`YYYY-MM-DD`). The four teacher-facing fields are what it measures, when, the instrument, and the link to an expected learning. `title` is the card heading. `occursOn` is the concrete date compared with `CalendarDay`. A scheduled date on `HOLIDAY` or `SUSPENDED` shows "Esta fecha está marcada como no lectiva en el calendario." and does not block continue.

Cards use the shared accept, edit, and regenerate routes with keys `evidence-formative-*` and `evidence-scheduled-*`. Continue on step 5 requires at least one complete formative card and one complete scheduled card.

`balance-assessment-load` replaces only the scheduled rows with the next stored load whose `rubricNames` are the same set as the current rubric names. Position does not matter. It does not delete or rename rubric rows, and it does not change rubric count or percentage. The exception is the third mathematics load, which may change the quiz count and move 10 percentage points from quices to desempeño en clase when those seeded names still match. An overlapping request that loses the claim does not apply another load. A card with no `occursOn` does not show the non-teaching-day warning, even when its week phrase covers a holiday. If no other stored load matches, the response is 409 with "No hay otra carga guardada para los rubros actuales."

Mathematics load 1 places Quiz 1 on 13 March and the written test on 27 March. Load 2 moves Quiz 1 to 20 March and leaves the written test on 27 March. Spanish stores a "Quiz de idea principal" in April. Science stores a "Práctica de reconocimiento de organelos" in February. Each scenario stores three loads.

## AdjustmentSet

Stored result of **Aplicar ajustes**, keyed by scenario as `ajuste-semana` in the stories and `adjustment-week` in the schema.

Applying it writes the stored texts into that week's sessions and into the MEP document rows. Edited adjustment cards replace the base text. Applying again replaces those fields; it does not insert duplicate rows.

## MepDocument

Consolidated document built the first time step 7 opens. Later views read the saved row, so Editar campos can diverge from earlier steps until an adjustment rewrites it. The scenario template is the stored `mep-template` variant. Nothing is drafted at open time.

The screen header shows `regionalDirectorate`, `schoolName`, `teacherName`, `subjectLabel`, `gradeLabel`, `schoolYear`, and `periodicity` (Mensual, with the month). It also shows `competencies` from that template. The body is at least two rows of `expectedLearning`, `mediationStrategy`, and `indicator`. Instruments from step 5 and `observations` appear below. If `teacher-notes` is `EDITED`, observations use that body instead of the template sentence. If `mediation-in-class` is `EDITED`, the first strategy is the activity names joined with "; ", or the body itself when it is plain text. The raw JSON is never the cell. An edited class session on the active week supplies the first expected learning. An edited formative evidence card supplies the first indicator from that card's expected learning. Curso lectivo is an editable header field.

`PATCH /api/plans/:planId/document` saves the header, table cells, and observations. An empty required field is stored and does not delete the document. Download stays blocked until that field has text. Continuar from a complete step 7 opens step 8 and leaves `Plan.adjustmentApplied` false.

Mathematics stores the competencies Ciudadanía responsable y solidaria and Competencias para la vida. The Spanish template includes «Lectura en voz alta del cuento de la semana». The science template includes «Observación guiada de la célula».

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

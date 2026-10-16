# Spec Delta

## Purpose

Lets the teacher combine checks during class with the evaluations already placed on the month calendar.

## ADDED Requirements

### Requirement: Two evidence columns
Step 5 SHALL show formative evidence on the left and scheduled evidence on the right, aligned with the step 2 rubric. Each card MUST be editable and MUST record what it measures, when, the instrument, and the link to an expected learning. Cards MUST accept, edit, and regenerate.

#### Scenario: Mathematics variant 1
- **WHEN** a plan uses mat-4-marzo-2026 and the teacher opens step 5 for the first time
- **THEN** the formative and scheduled cards match the instruments and dates in US-11

### Requirement: Balance the load
Equilibrar carga evaluativa del mes SHALL replace the scheduled column with the next stored distribution of dates and instruments. It MUST NOT delete or rename the step 2 rubric rows. A stored load matches when its rubric names are the same set as the current rubric names, regardless of position. If no stored load matches, the system MUST show "No hay otra carga guardada para los rubros actuales."

One completed balance action MUST apply one stored load. An overlapping request that loses the claim MUST NOT apply a further load. The action MUST NOT change rubric count or percentage, except when the applied load is the third mathematics load and the current names still match the seeded names. That third load MAY set Quices to count 1 and 10 percent and Desempeño en clase y prácticas to 30 percent. Formative cards MUST stay in place.

#### Scenario: Quiz moves
- **WHEN** the teacher chooses the balance action once on the initial mathematics load after changing a rubric percentage without renaming any row
- **THEN** the quiz date becomes Friday 20 March, the written test stays on 27 March, the edited percentage stays, and the formative cards stay

#### Scenario: Reordered rubric names still match
- **WHEN** the current rubric rows have the seeded mathematics names in a different position order and the teacher balances once
- **THEN** the quiz date becomes Friday 20 March

#### Scenario: Overlapping balance applies one load
- **WHEN** two balance requests overlap and both read the initial mathematics load
- **THEN** only the 20 March load is applied, and Quices stays at count 2 and 20 percent

### Requirement: Non-teaching date warning
When a scheduled evidence `occursOn` falls on a calendar day marked holiday or suspended, the card SHALL show "Esta fecha está marcada como no lectiva en el calendario." The warning compares that concrete date. It MUST NOT be inferred from the Spanish week phrase, so a scheduled card with no `occursOn` shows no warning even when its week contains a holiday. That warning MUST NOT block Continuar. Continuar MUST require at least one complete formative card and one complete scheduled card, then open step 6.

#### Scenario: Warning does not block
- **WHEN** a scheduled card falls on a holiday and both columns have one complete card
- **THEN** the warning is visible and Continuar opens step 6

#### Scenario: Suspended day warns
- **WHEN** a scheduled card's `occursOn` is a suspended calendar day and both columns have one complete card
- **THEN** the warning is visible and Continuar stays available

#### Scenario: Week phrase without a date does not warn
- **WHEN** a scheduled card has no `occursOn` and its week contains a holiday
- **THEN** the warning is not shown

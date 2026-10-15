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
Equilibrar carga evaluativa del mes SHALL replace the scheduled column with the next stored distribution of dates and instruments. It MUST NOT delete the step 2 rubric rows. If no stored load matches the current rubric names, the system MUST show "No hay otra carga guardada para los rubros actuales."

#### Scenario: Quiz moves
- **WHEN** the teacher chooses the balance action once on the initial mathematics load
- **THEN** the quiz date becomes Friday 20 March and the written test stays on 27 March

### Requirement: Non-teaching date warning
When a scheduled evidence falls on a calendar day marked holiday or suspended, the card SHALL show "Esta fecha está marcada como no lectiva en el calendario." That warning MUST NOT block Continuar. Continuar MUST require at least one complete formative card and one complete scheduled card, then open step 6.

#### Scenario: Warning does not block
- **WHEN** a scheduled card falls on a holiday and both columns have one complete card
- **THEN** the warning is visible and Continuar opens step 6

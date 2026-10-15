# Spec Delta

## Purpose

Lets a teacher define the curricular context of a new plan and fills the wizard from the stored scenario that matches that context.

## ADDED Requirements

### Requirement: Configuration screen
The system SHALL show Nuevo planeamiento with the support sentence from US-04, without the "Paso X de 8" indicator. Name, school, and regional directorate MUST start from the account and remain editable. The other fields MUST start empty, and the summary chips MUST update as values are chosen.

#### Scenario: Prefill from the account
- **WHEN** Juanita opens a new plan
- **THEN** her name, Escuela República de Arabia Saudita, and Dirección Regional San José are filled, and cycle, grade, subject, modality, year, month, section, student count, and weekly lessons are empty

### Requirement: Required configuration
The system SHALL enable Iniciar planeamiento con IA only when cycle, grade, subject, modality, school year, month, school, regional directorate, teacher name, section, student count, and weekly lessons are valid. Student count and weekly lessons MUST be integers greater than zero. A grade outside the selected cycle MUST show "Seleccione un nivel del ciclo elegido." The button MUST stay disabled while the create request is still running, and a second click MUST NOT create another plan. Periodicity MUST be monthly.

#### Scenario: Second click while creating
- **WHEN** the teacher starts a valid plan and clicks Iniciar planeamiento con IA again before the request finishes
- **THEN** the button stays disabled and only one plan is created

#### Scenario: Grade outside the cycle
- **WHEN** the teacher selects grade 4 under I y II Ciclos and then changes the cycle to Educación Diversificada
- **THEN** the start button stays disabled and the message "Seleccione un nivel del ciclo elegido." is shown

### Requirement: Scenario on create
The system SHALL save the plan, attach the scenario for school year, subject, grade, and month, mark steps 0 and 1 visited, and open step 1 filled with variant 1. If nothing matches, the system MUST use mat-4-marzo-2026 and record that the fallback was used. The wizard header MUST use the saved subject, grade, school, and teacher name.

#### Scenario: Mathematics March match
- **WHEN** Juanita starts a 2026, grade 4, mathematics, March plan for group 4.° A with 28 students and 5 weekly lessons
- **THEN** the plan is stored with scenario mat-4-marzo-2026 and step 1 shows the fractions extract

### Requirement: Scenario change keeps edits
When the teacher later changes school year, subject, grade, or month, the system SHALL select the scenario again. Blocks still suggested MUST show variant 1 of the new scenario. Accepted or edited blocks MUST keep their text. Modality, school, and group MUST NOT change the scenario.

#### Scenario: Edited block survives a subject change
- **WHEN** the teacher changes the subject after editing one card, accepting another, and leaving a third suggested
- **THEN** the edited card and the accepted card keep the teacher's text, and the suggested card reloads from the new scenario

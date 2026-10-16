# week-sessions Specification

## Purpose

Lets the teacher prepare each session of the selected week with a start, development, and close, and export that week.

## Requirements

### Requirement: Week and sessions
The selector SHALL list the scenario's stored weeks and select the active week. The active week MUST list five sessions, Monday through Friday. Two MUST start expanded and three collapsed, and the teacher MUST be able to expand or collapse them. An expanded session MUST show day, date, expected learning, 40-minute duration, start, development, close, materials, formative evidence, and homework when one exists. Edits MUST be saved.

#### Scenario: Mathematics week 2 layout
- **WHEN** the teacher opens step 6 on mat-4-marzo-2026
- **THEN** week 2 (9 al 13 de marzo) is selected and Monday and Wednesday start expanded

### Requirement: Generate and duplicate
Generar las 5 sesiones con IA SHALL replace the five sessions of the selected week with the next stored set and mark them suggested. Only the active week has a next stored set. For any other selected week the system MUST leave the five sessions unchanged and respond 409 with "Esta semana no tiene otro conjunto guardado." The generate control MUST be available only for the active week. Duplicar estructura SHALL copy start, development, close, materials, and formative evidence from the first expanded session onto the other sessions of that week, keeping each session's day, date, and expected learning. If no session is expanded, the system MUST show "Abra una sesión para duplicar su estructura."

#### Scenario: Duplicate keeps dates
- **WHEN** Monday is the first expanded session and the teacher chooses Duplicar estructura
- **THEN** the other sessions receive Monday's structure and keep their own dates

#### Scenario: Week without a stored set
- **WHEN** the teacher generates sessions for a week that is not the active week
- **THEN** the five sessions stay unchanged and the response is 409 with "Esta semana no tiene otro conjunto guardado."

### Requirement: Export and continue
Exportar semana SHALL download a PDF of the five saved sessions of the selected week, named `semana-{number}-{subject}-{month}-{year}.pdf` in lowercase without accents. The file's cross-reference MUST address the bytes that were written, including Spanish text with accents, and each drawn line MUST stay within the page width. Export MUST wait for a session save that is already in flight, so the PDF contains that saved text. Date and the 40-minute duration are shown and are not edited. A date sent outside that week's stored range MUST be rejected with "La fecha debe quedar dentro de esta semana." and the stored date MUST stay. Continuar MUST require expected learning, start, development, and close on all five active-week sessions. A valid Continuar MUST open step 7 and set the plan to ready for delivery.

#### Scenario: Ready for delivery
- **WHEN** the five sessions are complete and the teacher continues
- **THEN** step 7 opens and the plan status is ready for delivery

#### Scenario: Readable week PDF
- **WHEN** the teacher exports a week whose saved text includes accents
- **THEN** the PDF cross-reference points at each object and the text still contains those accents, with no drawn line wider than the page

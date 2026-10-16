# Spec Delta

## Purpose

Assembles the teacher's saved decisions into one institutional MEP-style document that can be reviewed before download.

## ADDED Requirements

### Requirement: Assembled document
On entering step 7 the system SHALL build the document from the saved plan and the scenario template. It MUST NOT draft new prose with a language model. The header MUST show regional directorate, school, teacher name, subject, grade, school year, and monthly periodicity with the month. General competencies stored on the scenario MUST be shown. The body MUST be a three-column table of expected learning, mediation strategies, and indicators, with at least two complete rows. Instruments from step 5 and observations from the group profile MUST appear below. The visible state MUST be "Listo para entrega a dirección". An edited `mediation-in-class` block feeds the first row's strategy as the activity names joined with "; ", never as the raw JSON. A plain-text body is used as written. An edited class session on the active week feeds the first row's expected learning. An edited formative evidence card feeds the first row's indicator from that card's expected learning. Cells without an edited source stay on the scenario template.

#### Scenario: Edited diagnosis becomes the observation
- **WHEN** the teacher changed the group observation before opening step 7
- **THEN** the document observation uses that saved text rather than the untouched scenario sentence

#### Scenario: Edited mediation stays readable
- **WHEN** the teacher edited the in-class mediation table before opening step 7
- **THEN** the first strategy lists those activity names and does not contain the raw JSON

#### Scenario: Edited session and evidence fill the first row
- **WHEN** the teacher edited the active week's first session learning and a formative evidence card before opening step 7
- **THEN** the first row uses that learning and that card's expected learning, and the second row stays on the template

### Requirement: Edit fields
Editar campos SHALL allow correction of the header, including the school year, the table cells, and the observations. Those corrections MUST be saved and MUST be the text later included in the PDF. If a required document field is empty, Descargar PDF MUST NOT create a file and MUST indicate the field, while the document view remains.

#### Scenario: Empty required field
- **WHEN** a required document field is cleared
- **THEN** the document stays on screen and download does not start

### Requirement: Leave the step
Atrás SHALL return to step 6. If step 8 has not been opened, it MUST stay closed until Continuar. Continuar MUST open step 8 with the adjustment not yet applied.

#### Scenario: Continue does not apply adjustments
- **WHEN** the teacher continues from a complete step 7
- **THEN** step 8 opens and no adjustment has been applied

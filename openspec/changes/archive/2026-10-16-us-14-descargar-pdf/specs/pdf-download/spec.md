# Spec Delta

## Purpose

Lets the teacher preview and download a PDF built from the saved plan, and download a separate file for one week.

## ADDED Requirements

### Requirement: Institutional PDF
Vista previa PDF SHALL show the print view of the consolidated document with the same text the download would contain at that moment. Descargar PDF SHALL produce a file with the saved header, table, instruments, and observations, including edits made in Editar campos. Both actions MUST wait for a field save that is already in flight before requesting the file. The file name MUST be `planeamiento-{subject}-{grade}-{month}-{year}.pdf` in lowercase without accents. Juanita's mathematics plan MUST use `planeamiento-matematica-4-marzo-2026.pdf`. A later download after an observation edit MUST contain the new observation. A character that does not fit the PDF encoding MUST be written as a readable ASCII stand-in, so the saved periodicity `Mensual — Marzo` MUST appear as `Mensual - Marzo` and MUST NOT be stored as a control character. If the PDF request fails, the page MUST show that error message.

#### Scenario: Edited observation is in the new file
- **WHEN** Juanita changes an observation and downloads again
- **THEN** the new PDF contains the new observation and not the previous sentence

#### Scenario: Periodicity stays readable
- **WHEN** the saved periodicity is `Mensual — Marzo`
- **THEN** the PDF text contains `Mensual - Marzo` and does not contain a control character in place of the dash

#### Scenario: Download waits for the edit in flight
- **WHEN** Juanita edits an observation and downloads while that save is still in flight
- **THEN** the PDF request starts only after the save finishes

### Requirement: Missing field and ownership
If a required document field is empty, the system SHALL NOT download a file and MUST indicate the field. A teacher MUST NOT be able to download another teacher's plan.

#### Scenario: Other teacher's file
- **WHEN** a signed-in teacher requests the PDF of a plan they do not own
- **THEN** no file is downloaded

### Requirement: Week file
Exportar semana SHALL generate a PDF from the five saved sessions of the selected week only. It MUST NOT reuse the full institutional PDF.

#### Scenario: Week file is not the institutional document
- **WHEN** the teacher exports week 2
- **THEN** the file contains those five sessions and is not the full MEP document

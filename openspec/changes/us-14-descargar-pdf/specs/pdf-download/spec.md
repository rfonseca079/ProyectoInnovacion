# Spec Delta

## Purpose

Lets the teacher preview and download a PDF built from the saved plan, and download a separate file for one week.

## ADDED Requirements

### Requirement: Institutional PDF
Vista previa PDF SHALL show the print view of the consolidated document with the same text the download would contain at that moment. Descargar PDF SHALL produce a file with the saved header, table, instruments, and observations, including edits made in Editar campos. The file name MUST be `planeamiento-{subject}-{grade}-{month}-{year}.pdf` in lowercase without accents. Juanita's mathematics plan MUST use `planeamiento-matematica-4-marzo-2026.pdf`. A later download after an observation edit MUST contain the new observation.

#### Scenario: Edited observation is in the new file
- **WHEN** Juanita changes an observation and downloads again
- **THEN** the new PDF contains the new observation and not the previous sentence

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

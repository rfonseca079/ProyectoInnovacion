# Design

## Context

See proposal.md. Preview and both downloads read saved rows. There is no checked-in sample PDF.

## Goals / Non-Goals

**Goals:**

- Generate the institutional PDF and the week PDF on the server.
- Use the same bytes for preview and download of the institutional document.

**Non-Goals:**

- Emailing the file, storing the PDF as the source of truth, or a mobile print layout.

## Decisions

- `GET /api/plans/:planId/document/pdf` renders `MepDocument` plus instruments and observations. A missing required field returns 422 JSON that names the field and is not a PDF. Another teacher's id returns 404.
- The PDF font is WinAnsi. A character outside that encoding is replaced before it is written: the em dash in `Mensual — Marzo` becomes a hyphen, so the file contains `Mensual - Marzo`.
- Vista previa PDF and Descargar PDF wait for a document save already in flight, then request this same resource. A rejected request shows its message on the page.
- The filename is built from subject, grade, month, and year, lowercased and stripped of accents. Juanita's file is `planeamiento-matematica-4-marzo-2026.pdf`.
- Preview requests that same resource and shows it in a print view. It does not write a second file.
- `GET /api/plans/:planId/weeks/:weekNumber/pdf` renders only the five sessions. If US-12 already added the route, this change completes the institutional renderer and shares the filename helper.

Alternative considered: a static PDF per scenario. Rejected because an edited observation must appear in the next download.

## Risks / Trade-offs

- [PDF library choice is not fixed in the spec] → Pick one Node PDF library in implementation and cover the required sentences with a text extraction test. Do not add a language-model renderer.

## Migration Plan

No new table. Rollback removes the download routes.

## Open Questions

None.

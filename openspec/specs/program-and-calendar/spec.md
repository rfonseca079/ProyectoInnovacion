# program-and-calendar Specification

## Purpose

Lets the teacher review the stored official-program extract, the usable time, and the month calendar before continuing the plan.

## Requirements

### Requirement: Three zones
Step 1 SHALL show the title and support sentence from US-07, the program extract, available time, and the month calendar from the plan's scenario. The calendar MUST use the stored marks and the legend Lectivo, Feriado, Suspendido, and Evaluación. A day without a stored mark MUST NOT receive one of those kind labels. The system MUST NOT calculate holidays at display time.

#### Scenario: March mathematics calendar
- **WHEN** a plan uses mat-4-marzo-2026 and the teacher opens step 1
- **THEN** 6 March is Suspendido, 13 and 27 March are Evaluación, and 30 and 31 March are Feriado

#### Scenario: Unmarked day
- **WHEN** the teacher opens step 1 and a day of that month has no stored mark
- **THEN** that day is not labeled Lectivo, Feriado, Suspendido, or Evaluación

### Requirement: Reanalyze and cards
Reanalizar programa SHALL cycle the stored extract variants 1, 2, and 3, then return to 1. Available time and restrictions MUST be editable and autosaved. The three cards Objetivos priorizados del mes, Contenidos que caben en el tiempo disponible, and Riesgos de calendario MUST each offer Aceptar sugerencia, Editar, and Regenerar. Editar MUST focus that card's text. Regenerar MUST cycle only that card. If the card is still SUGGESTED, the visible text changes. If the teacher had edited it, Regenerar advances the stored variant and the visible text stays.

#### Scenario: Extract cycle
- **WHEN** variant 1 of the mathematics extract is visible and the teacher chooses Reanalizar programa twice
- **THEN** the second press shows the variant whose learning includes "Plantear problemas de la comunidad con fracciones."

#### Scenario: Edited card keeps its text
- **WHEN** the objectives card was edited and the teacher chooses Regenerar
- **THEN** the visible text stays and the card remains EDITED

### Requirement: Continue
Continuar SHALL stay blocked until the extract, plannable lessons, affected lessons, and the three cards contain text. A valid Continuar MUST open step 2.

#### Scenario: Empty card blocks continue
- **WHEN** one of the three cards has no text
- **THEN** Continuar does not open step 2

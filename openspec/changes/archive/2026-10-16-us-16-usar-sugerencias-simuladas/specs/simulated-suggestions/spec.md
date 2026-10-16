# Spec Delta

## Purpose

Makes every apparent AI action read a prepared variant from storage so the teacher can accept, edit, or request another suggestion without a language model.

## ADDED Requirements

### Requirement: No language model
No wizard action SHALL call a language-model service or invent a paragraph at request time. If no further text is stored, the system MUST show "No hay otra sugerencia guardada para este bloque." There MUST be no side chat. Suggestions MUST appear as cards inside the step.

#### Scenario: Missing variant
- **WHEN** the teacher requests another suggestion and no further variant is stored
- **THEN** the step shows "No hay otra sugerencia guardada para este bloque."
- **AND** a named action with no stored text uses that same sentence

#### Scenario: Card shows the Spanish state
- **WHEN** a card is suggested, accepted, or edited
- **THEN** the card shows "Sugerido por IA", "Aceptada", or "Editada"

### Requirement: First visit and card actions
The first time a step opens, its fields and cards SHALL show variant 1 of the associated scenario, marked Sugerido por IA, and that text MUST already be part of the draft. Aceptar sugerencia MUST keep that text and mark the card Aceptada. Editar MUST save the change and mark the card Editada. Regenerar MUST cycle variants 1, 2, and 3. While the card is still Sugerido por IA, Regenerar MUST also update the visible field. After Aceptada or Editada, the field MUST keep the teacher's text until they accept the new variant.

#### Scenario: Regenerate does not replace an edit
- **WHEN** the teacher has edited a card and then chooses Regenerar
- **THEN** the card shows the next variant and the saved field keeps the edited text until the teacher accepts the new variant

#### Scenario: Accept applies the pending variant after reload
- **WHEN** the teacher edited a card, regenerated, reloads the plan, and accepts
- **THEN** the saved field becomes the stored text of the current variant and the card is Aceptada
- **AND** accepting an edit that was not regenerated keeps the edited text
- **AND** leaving the field without changing it does not discard the pending variant

### Requirement: Named actions replace visible text
Reanalizar programa, Redistribuir con IA, Generar implicaciones pedagógicas, Regenerar mediación, Ajustar a 40 minutos, Simplificar materiales, Equilibrar carga evaluativa del mes, and Generar las 5 sesiones con IA SHALL load the stored variant for that action. The action MUST replace the visible text even if the card was accepted or edited, and MUST mark the affected cards Sugerido por IA again.

#### Scenario: Named action overwrites an acceptance
- **WHEN** the teacher has accepted a card and then chooses the named action for that block
- **THEN** the visible text is replaced and the card is Sugerido por IA

#### Scenario: Non-active week uses its stored set
- **WHEN** the teacher generates the five sessions for a week that is not the active week and that week has three stored variants
- **THEN** those sessions become the next stored set

### Requirement: Scenario match and fallback
The system SHALL choose the scenario when the plan is created and again when school year, subject, grade, or month changes. Modality, school, and group MUST NOT change the scenario. A match MUST use that scenario's texts. No match MUST use mat-4-marzo-2026 and every step MUST show "No hay un escenario específico para esta combinación. Las sugerencias corresponden a Matemática, 4.° año, marzo 2026." The plan header MUST keep the teacher's configuration. A scenario change MUST update only blocks still marked Sugerido por IA.

#### Scenario: Social studies fallback
- **WHEN** the teacher configures Estudios Sociales for a combination that has no scenario
- **THEN** the suggestions are the mathematics March 2026 texts, the fallback sentence is shown, and the header still says Estudios Sociales

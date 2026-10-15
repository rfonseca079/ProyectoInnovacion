# Spec Delta

## Purpose

Keeps the working plan saved while the teacher edits it, and tells the truth when a save fails.

## ADDED Requirements

### Requirement: Autosave triggers
The system SHALL save when the teacher leaves a changed field, accepts a suggestion, edits a suggestion, regenerates a block whose visible text changes, adds or removes a rubric row, changes the notification toggle, applies adjustments, or changes step.

#### Scenario: Field blur saves
- **WHEN** the teacher changes a field and leaves it
- **THEN** the plan is stored and the list update time changes

### Requirement: Footer messages
After a successful save the footer SHALL say "Borrador guardado automáticamente". After a failed save the footer SHALL say "No se pudo guardar el borrador. Intente de nuevo." and the text typed on screen MUST remain.

#### Scenario: Failed save
- **WHEN** a save request fails
- **THEN** the failure sentence is shown and the field still contains what the teacher typed

### Requirement: Resume and isolation
The system SHALL reopen a plan on the last saved step with the last saved content for the same teacher. Another teacher's saved content MUST NOT appear.

#### Scenario: Return after logout
- **WHEN** the teacher signs in again after an autosave
- **THEN** the plan opens on the last saved step with the saved content

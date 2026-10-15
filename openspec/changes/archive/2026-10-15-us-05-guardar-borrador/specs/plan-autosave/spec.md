# Spec Delta

## Purpose

Keeps the working plan saved while the teacher edits it, and tells the truth when a save fails.

## ADDED Requirements

### Requirement: Autosave triggers
The system SHALL save when the teacher leaves a field whose value changed. Accepting or editing a suggestion, regenerating a block, adding or removing a rubric row, changing the notification toggle, applying adjustments, and changing step are not controls on this screen. When a later change adds one of those actions, that action MUST persist through this same partial save.

#### Scenario: Field blur saves
- **WHEN** the teacher changes a field and leaves it
- **THEN** the plan is stored and the list update time changes

#### Scenario: Unchanged field
- **WHEN** the teacher leaves a field without changing it
- **THEN** the system does not send a save

#### Scenario: Blur during a save
- **WHEN** the teacher leaves the field again with a newer value while the previous save is still running
- **THEN** the second request waits until the first one finishes, and the stored value is the newer text

### Requirement: Footer messages
After a successful save the page footer SHALL say "Borrador guardado automáticamente". Changing the field again MUST clear that sentence until the next save finishes. After a failed save the page footer SHALL say "No se pudo guardar el borrador. Intente de nuevo." and the text typed on screen MUST remain.

#### Scenario: Failed save
- **WHEN** a save request fails
- **THEN** the failure sentence is shown and the field still contains what the teacher typed

#### Scenario: Editing clears the success sentence
- **WHEN** the teacher changes the field after a successful save
- **THEN** the footer no longer says "Borrador guardado automáticamente"

### Requirement: Resume and isolation
The system SHALL reopen a plan on the last saved step with the last saved content for the same teacher. Another teacher's saved content MUST NOT appear.

#### Scenario: Return after logout
- **WHEN** the teacher signs in again after an autosave
- **THEN** the plan opens on the last saved step with the saved content

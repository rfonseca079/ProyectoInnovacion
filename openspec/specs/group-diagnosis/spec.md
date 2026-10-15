# group-diagnosis Specification

## Purpose

Lets the teacher record how the class arrives so later screens can show suggestion text already stored for that context.

## Requirements

### Requirement: Group profile
Step 3 SHALL include prior knowledge, difficulties, classroom resources, pace, required supports, and teacher observations. All six MUST contain text before Continuar. An empty field MUST be indicated and MUST block Continuar. Saving one field MUST NOT replace text the teacher has typed in another field that has not been saved yet.

#### Scenario: Empty observation
- **WHEN** the teacher clears the observations and chooses Continuar
- **THEN** Continuar does not advance and the empty field is indicated

#### Scenario: Unsaved field stays
- **WHEN** the teacher types in observations and another field finishes saving
- **THEN** the observations text stays

### Requirement: No sensitive student records
Supports SHALL be general classroom help. The screen MUST NOT include a formal curricular-accommodation section and MUST NOT ask for sensitive student data.

#### Scenario: Screen contents
- **WHEN** the teacher opens step 3
- **THEN** the six general fields are present and no formal accommodation section is present

### Requirement: Implication cards
Generar implicaciones pedagógicas SHALL show three stored cards: manipulatives, scaffolding, and light differentiation. Choosing it again MUST load the next stored set of three. Two overlapping calls MUST NOT apply the same stored set twice. Regenerar on one card MUST cycle only that card. Another teacher MUST receive 404 and MUST NOT change the cards. If generating fails, the step MUST show the error. The first successful Continuar MUST mark step 4 visited.

#### Scenario: Generate replaces all three
- **WHEN** the mathematics implication cards are visible and the teacher chooses Generar implicaciones pedagógicas
- **THEN** all three cards change together and the new set includes "Iniciar la recta numérica solo después de la representación concreta."

#### Scenario: Another teacher
- **WHEN** Carlos chooses Generar implicaciones pedagógicas on Juanita's plan
- **THEN** the response is 404 and her cards stay unchanged

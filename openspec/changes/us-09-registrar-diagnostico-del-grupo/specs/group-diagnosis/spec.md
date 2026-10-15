# Spec Delta

## Purpose

Lets the teacher record how the class arrives so later screens can show suggestion text already stored for that context.

## ADDED Requirements

### Requirement: Group profile
Step 3 SHALL include prior knowledge, difficulties, classroom resources, pace, required supports, and teacher observations. All six MUST contain text before Continuar. An empty field MUST be indicated and MUST block Continuar.

#### Scenario: Empty observation
- **WHEN** the teacher clears the observations and chooses Continuar
- **THEN** Continuar does not advance and the empty field is indicated

### Requirement: No sensitive student records
Supports SHALL be general classroom help. The screen MUST NOT include a formal curricular-accommodation section and MUST NOT ask for sensitive student data.

#### Scenario: Screen contents
- **WHEN** the teacher opens step 3
- **THEN** the six general fields are present and no formal accommodation section is present

### Requirement: Implication cards
Generar implicaciones pedagógicas SHALL show three stored cards: manipulatives, scaffolding, and light differentiation. Choosing it again MUST load the next stored set of three. Regenerar on one card MUST cycle only that card. The first successful Continuar MUST mark step 4 visited.

#### Scenario: Generate replaces all three
- **WHEN** the mathematics implication cards are visible and the teacher chooses Generar implicaciones pedagógicas
- **THEN** all three cards change together and the new set includes "Iniciar la recta numérica solo después de la representación concreta."

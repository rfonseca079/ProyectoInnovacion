# Spec Delta

## Purpose

Lets a teacher move through the nine planning steps in order and reopen only the steps already visited.

## ADDED Requirements

### Requirement: Shared chrome
The header SHALL show Planificador AI, the saved subject, grade, school, and teacher name, plus Mis planeamientos and Cerrar sesión. Mis planeamientos MUST return to the list without discarding a saved draft. The bar MUST list the nine step names from US-06 in order. Steps 1 through 8 MUST show "Paso X de 8". Configuration MUST NOT show that indicator.

#### Scenario: Header context
- **WHEN** the teacher is inside a saved plan
- **THEN** the header shows the saved subject, grade, school, and teacher name

### Requirement: Forward only when valid
Steps 1 through 7 SHALL show Atrás and Continuar. Continuar MUST open the next step only when the current step's required fields are valid, including a 100 percent rubric on the evaluation step. A blocked Continuar MUST explain what is missing and MUST NOT mark the next step visited. A successful Continuar MUST mark the destination visited and save the draft.

#### Scenario: Invalid step does not advance
- **WHEN** the teacher chooses Continuar while a required field is empty
- **THEN** the next step stays unvisited and the missing field is explained

### Requirement: Visited steps
Atrás MUST open the previous step even when the current step is invalid. A visited step MUST be openable from the bar without validating the current step. An unvisited step MUST stay visible and not openable. Step 8 MUST NOT show Continuar. From configuration, Atrás MUST return to the plan list.

#### Scenario: Seeded visit limits
- **WHEN** Juanita, Carlos, and María open their seeded plans
- **THEN** Juanita can open steps 0 through 4, Carlos can open steps 0 through 7 but not 8, and María can open steps 0 through 8

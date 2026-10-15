# Spec Delta

## Purpose

Lets the teacher order the month's units and set evaluation percentages that sum to 100 percent.

## ADDED Requirements

### Requirement: Weeks and rubric
Step 2 SHALL show four editable week titles and a table of rubric name, count, and percentage. The total MUST be calculated from the entered percentages. When the total is 100 and every week and rubric has a name, the system SHALL show Distribución completa. Otherwise Continuar MUST NOT advance and MUST show "La distribución debe sumar 100 %."

#### Scenario: Complete mathematics distribution
- **WHEN** the five seeded mathematics rows are unchanged
- **THEN** the total is 100 and Distribución completa is shown

### Requirement: Add and remove rows
Agregar rubro SHALL add an editable row with percentage 0 and recalculate the total. Quitar SHALL remove the chosen row and MUST NOT remove the last remaining row.

#### Scenario: Last row
- **WHEN** only one rubric row remains and the teacher chooses Quitar
- **THEN** the row stays

### Requirement: Stored redistribution
Redistribuir con IA SHALL replace percentages with the next stored distribution that has the same number of rows and already sums to 100. Edited rubric names MUST stay. If no stored distribution matches the row count, the system MUST show "No hay una distribución guardada para esta cantidad de rubros." The justification card MUST accept, edit, and regenerate.

#### Scenario: Five-row redistribution
- **WHEN** the teacher has five rows and chooses Redistribuir con IA once from the 30, 20, 15, 20, 15 distribution
- **THEN** the percentages become 25, 15, 20, 25, and 15 and the names stay

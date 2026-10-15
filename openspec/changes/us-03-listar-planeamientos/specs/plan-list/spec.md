# Spec Delta

## Purpose

Shows each teacher only their own plans so they can resume one or start another.

## ADDED Requirements

### Requirement: Owned plans only
The system SHALL list only plans owned by the signed-in teacher. Each row MUST show subject, grade, month, school year, school, status, and last update.

#### Scenario: Three demo accounts
- **WHEN** Juanita, Carlos, and María each open the list
- **THEN** each list contains only that teacher's seeded plan, with the labels described in US-03

### Requirement: Status labels
The system SHALL show a draft as "Borrador · Paso N de 8" using the saved step, a ready plan as "Listo para entrega", and an adjusted plan as "Ajustado".

#### Scenario: Juanita's draft label
- **WHEN** Juanita opens the list
- **THEN** her row shows Borrador · Paso 4 de 8 and the date 10 de marzo de 2026

### Requirement: Resume and create
The system SHALL open a plan on its last saved step, with already visited steps available and unvisited steps closed. Nuevo planeamiento MUST open plan configuration. An empty list MUST show "Aún no tiene planeamientos." and Nuevo planeamiento.

#### Scenario: Carlos resumes on the document
- **WHEN** Carlos opens his plan
- **THEN** the system opens step 7, steps 0 through 7 are available, and step 8 is not

#### Scenario: Empty list
- **WHEN** a teacher has no plans
- **THEN** the list shows "Aún no tiene planeamientos." and Nuevo planeamiento

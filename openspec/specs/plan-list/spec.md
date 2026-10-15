# plan-list Specification

## Purpose

Shows each teacher only their own plans so they can resume one or start another.

## Requirements

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
The system SHALL open a plan at the address of its last saved step. Nuevo planeamiento MUST open plan configuration. After a successful list response with no rows, the list MUST show "Aún no tiene planeamientos." and Nuevo planeamiento. That sentence MUST NOT appear while the list request is still running or when the request fails. A failed request MUST show "No se pudieron cargar los planeamientos." Which of those steps can be opened after the address loads belongs to wizard navigation.

#### Scenario: Carlos resumes on the document
- **WHEN** Carlos opens his plan
- **THEN** the address is that plan at step 7

#### Scenario: Empty list
- **WHEN** the list request finishes and the teacher has no plans
- **THEN** the list shows "Aún no tiene planeamientos." and Nuevo planeamiento

#### Scenario: List still loading
- **WHEN** the teacher is signed in and the list request has not finished
- **THEN** the list does not show "Aún no tiene planeamientos."

#### Scenario: List request fails
- **WHEN** the list request fails
- **THEN** the list does not show "Aún no tiene planeamientos." and shows "No se pudieron cargar los planeamientos."

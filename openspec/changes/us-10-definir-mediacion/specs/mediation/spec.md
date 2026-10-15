# Spec Delta

## Purpose

Lets the teacher define in-class and out-of-class mediation for the active week, including stored shorter and simpler variants.

## ADDED Requirements

### Requirement: Active week mediation
Step 4 SHALL show the scenario's active week. In-class rows MUST include activity, teacher role, student role, time, and materials. Out-of-class items MUST include the task and its learning purpose. Edits MUST be saved.

#### Scenario: Mathematics week 2
- **WHEN** a plan uses mat-4-marzo-2026 and the teacher opens step 4
- **THEN** the active week is week 2, Fracciones equivalentes, and the initial rows match US-10

### Requirement: Named mediation actions
Regenerar mediación, Ajustar a 40 minutos, and Simplificar materiales SHALL each cycle their own stored variants and then return to the first. Each action MUST replace the visible text and mark it suggested until the teacher accepts or edits it. Ajustar a 40 minutos MUST load a stored set whose times sum to 40 minutes without changing the week's topic.

#### Scenario: Forty-minute variant
- **WHEN** the teacher chooses Ajustar a 40 minutos on the mathematics mediation
- **THEN** the times are 8, 14, 12, and 6 minutes

### Requirement: Continue without a 40-minute total
Continuar SHALL require at least one in-class activity and a time on every row. It MUST NOT require the times to sum to 40. A valid Continuar MUST open step 5.

#### Scenario: Unadjusted times can continue
- **WHEN** the visible times sum to 60 minutes and every row has a time
- **THEN** Continuar opens step 5

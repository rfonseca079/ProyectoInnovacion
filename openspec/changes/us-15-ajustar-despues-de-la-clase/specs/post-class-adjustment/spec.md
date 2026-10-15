# Spec Delta

## Purpose

Lets the teacher record what happened in class and apply a stored adjustment to that week's sessions and the MEP document.

## ADDED Requirements

### Requirement: Planned versus executed
Step 8 SHALL show, for the stored reference session, what was planned, what was executed, learnings achieved, pending learnings, and collected evidence. Those fields MUST be editable and saved. Three adjustment cards MUST accept, edit, and regenerate. The teacher log MUST be editable and saved. Before apply, the week sketch MUST show the original week. After apply, it MUST show the stored updated week.

#### Scenario: María opens before apply
- **WHEN** María opens her seeded plan
- **THEN** step 8 is shown and the adjustment has not been applied

### Requirement: Notification toggle
The toggle Notificar cambios en evaluaciones calendarizadas SHALL start off. The system MUST save whether it is on or off and MUST NOT send any notification.

#### Scenario: Toggle on sends nothing
- **WHEN** the teacher turns the toggle on and saves
- **THEN** the choice is stored and no message is sent

### Requirement: Apply stored adjustment
Aplicar ajustes al planeamiento SHALL write the scenario's stored adjustment set into that week's sessions and the MEP table. A card the teacher edited before apply MUST be used instead of the base text. After apply, the plan status MUST be Ajustado, step 7 MUST show the updated document, and a new PDF MUST include the changes. Applying again MUST replace the previous adjustment texts and MUST NOT duplicate rows.

#### Scenario: Mathematics Tuesday rewrite
- **WHEN** the teacher applies the mathematics adjustment set
- **THEN** Tuesday 10 March starts with the missing equivalents close, guided practice is 12 minutes, and the MEP equivalents row uses the stored retake strategy

### Requirement: Return to the document
Volver al formato MEP actualizado SHALL open step 7 with the modified document when an adjustment was applied. If none was applied, it MUST open the current document and show "Aún no hay ajustes aplicados." Atrás MUST return to step 7.

#### Scenario: Return before apply
- **WHEN** the teacher chooses Volver al formato MEP actualizado before applying
- **THEN** step 7 opens and shows "Aún no hay ajustes aplicados."

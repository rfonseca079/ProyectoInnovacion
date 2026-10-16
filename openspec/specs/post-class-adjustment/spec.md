# post-class-adjustment Specification

## Purpose

Lets the teacher record what happened in class and apply a stored adjustment to that week's sessions and the MEP document.

## Requirements

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
Aplicar ajustes al planeamiento SHALL write the scenario's stored adjustment set into that week's sessions and the MEP table. Leaving a card unchanged, including focusing it, MUST NOT replace those stored result sentences. A card whose text the teacher changed MUST replace the matching session text, and accepting that card MUST keep the changed text. The first card's changed text MUST also replace the MEP mediation strategy. After apply, the plan status MUST be Ajustado, step 7 MUST show the updated document, and a new PDF MUST include the changes. Applying again MUST replace the previous adjustment texts and MUST NOT duplicate rows.

#### Scenario: Mathematics Tuesday rewrite
- **WHEN** the teacher applies the mathematics adjustment set
- **THEN** Tuesday 10 March starts with the missing equivalents close, guided practice is 12 minutes, and the MEP equivalents row uses the stored retake strategy

#### Scenario: Unchanged card keeps the stored result
- **WHEN** the teacher leaves the first mathematics card unchanged and applies
- **THEN** Tuesday still starts with the missing equivalents close and the MEP row keeps the retake strategy

#### Scenario: Edited card updates the session and the MEP strategy
- **WHEN** the teacher changes the first adjustment card and applies
- **THEN** that text is the Tuesday start and the MEP equivalents strategy, and the PDF includes it

#### Scenario: Accepted edit is kept
- **WHEN** the teacher changes the first card and accepts it before applying
- **THEN** that text is still the Tuesday start and the MEP strategy

### Requirement: Return to the document
Volver al formato MEP actualizado SHALL open step 7 with the modified document when an adjustment was applied. If none was applied, it MUST open the current document and show "Aún no hay ajustes aplicados." Atrás MUST return to step 7.

#### Scenario: Return before apply
- **WHEN** the teacher chooses Volver al formato MEP actualizado before applying
- **THEN** step 7 opens and shows "Aún no hay ajustes aplicados."

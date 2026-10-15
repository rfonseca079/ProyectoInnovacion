# Spec Delta

## Purpose

Lets a teacher end the current session on a shared computer without deleting the plan already saved for that account.

## ADDED Requirements

### Requirement: Logout control
The system SHALL show Cerrar sesión in the header while a session is active, both on the plan list and inside the wizard.

#### Scenario: Header control
- **WHEN** a teacher is signed in on the list or in a plan
- **THEN** the header shows Cerrar sesión

### Requirement: Session ends
The system SHALL end the session when the teacher chooses Cerrar sesión and MUST then show the login screen. Browser Back and a later refresh MUST keep the person on the login screen.

#### Scenario: Logout and back
- **WHEN** the teacher chooses Cerrar sesión and then uses the browser Back button
- **THEN** the login screen is shown and the list or plan is not shown

### Requirement: Saved draft remains
The system SHALL keep the teacher's already saved plan in storage after logout so the same account can open it on the next session.

#### Scenario: Draft survives logout
- **WHEN** the teacher logs out after a draft has been saved and later signs in again
- **THEN** that draft is still available to the same account

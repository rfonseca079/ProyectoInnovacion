# teacher-login Specification

## Purpose

Lets a seeded teacher enter Planificador AI with email and password and keeps every other account out of their plans.

## Requirements

### Requirement: Login form
The system SHALL show a desktop login screen titled Planificador AI with the fields Correo and Contraseña and the button Entrar. The screen MUST NOT offer registration, password recovery, or guest entry.

#### Scenario: Login screen contents
- **WHEN** a person opens the login screen
- **THEN** the screen shows Planificador AI, Correo, Contraseña, and Entrar, and it does not show registration, recovery, or guest actions

### Requirement: Empty credentials
The system SHALL refuse login when email or password is empty and MUST show the message "Ingrese su correo y su contraseña."

#### Scenario: Missing password
- **WHEN** the person submits an email and an empty password
- **THEN** no session starts and the message "Ingrese su correo y su contraseña." is shown

### Requirement: Invalid credentials
The system SHALL refuse an unknown email and a wrong password with the same message, "Correo o contraseña incorrectos.", and MUST NOT reveal which field failed.

#### Scenario: Unknown email and wrong password
- **WHEN** the person submits an unknown email, and separately submits a known email with a wrong password
- **THEN** both attempts stay signed out and both show "Correo o contraseña incorrectos."

### Requirement: Successful session
The system SHALL start a session for a seeded teacher, return that teacher's profile without the password hash, and open that teacher's plan list. The session MUST remain after a page refresh and MUST end when the browser closes.

#### Scenario: Juanita signs in
- **WHEN** Juanita Pérez submits juanita.perez@demo.mep.cr and the seeded demo password
- **THEN** a session starts, the password hash is not returned, and her plan list opens

#### Scenario: Refresh keeps the session
- **WHEN** a signed-in teacher refreshes the page
- **THEN** the session is still active

### Requirement: Route protection
The system SHALL send a signed-in teacher who opens login to the plan list, and SHALL send a signed-out person who opens the list or a plan to the login screen. A plan owned by another teacher MUST be hidden with the message "No tiene acceso a este planeamiento."

#### Scenario: Signed-in visit to login
- **WHEN** a teacher with an active session opens the login screen
- **THEN** the system opens that teacher's plan list

#### Scenario: Another teacher's plan
- **WHEN** a signed-in teacher opens the address of a plan owned by a different teacher
- **THEN** the plan is not shown and the message is "No tiene acceso a este planeamiento."

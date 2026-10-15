# Proposal

## Why

A shared school computer must not stay inside a teacher's account after they leave. US-02 requires an explicit logout that ends the session without deleting the saved draft.

## What Changes

- Add Cerrar sesión on the plan list and inside the wizard header.
- End the session and clear the cookie, then show the login screen.
- Keep the browser Back button and a refresh on the login screen.
- Leave already saved plans in the database for the next session of the same teacher.

## Capabilities

### New Capabilities

- `teacher-logout`: End the current session without deleting plan data.

### Modified Capabilities

- None. `teacher-login` is still an in-flight change, not a published spec.

## Impact

- `POST /api/auth/logout` returning 204.
- Header control in `frontend/src/components/AppHeader.tsx`, rendered by the plan list and the wizard.
- `backend/src/application/logoutTeacher.ts`.
- The in-memory plan list is cleared on logout in `frontend/src/App.tsx`.
- Depends on the session created by US-01.

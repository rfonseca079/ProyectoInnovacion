# Proposal

## Why

Teachers need a working sign-in before they can see their own plans. The demo has no application code yet, and the enriched US-01 story is the source for that gate. Without it, every later story is unreachable.

## What Changes

- Add a desktop login screen titled Planificador AI, with Correo, Contraseña, and Entrar.
- Authenticate only seeded teachers. No registration, password recovery, or guest entry.
- Start an httpOnly session cookie that survives refresh and ends when the browser closes.
- Return the same Spanish error for an unknown email and a wrong password.
- Redirect an existing session away from login, and send unauthenticated visits to the plan list or a plan URL back to login.
- Hide another teacher's plan and answer as not found.

## Capabilities

### New Capabilities

- `teacher-login`: Seeded email and password sign-in, session cookie, and access checks.

### Modified Capabilities

- None. The project has no published specs yet.

## Impact

- New `POST /api/auth/login` and `GET /api/auth/me` in `docs/api-spec.yml`.
- `Teacher` rows and password hashes in `backend/prisma/seed.ts`.
- `frontend/src/pages/LoginPage.tsx`, `authService.ts`, and the route guard in `App.tsx`.
- No LLM client, no `localStorage` token, no mobile layout.

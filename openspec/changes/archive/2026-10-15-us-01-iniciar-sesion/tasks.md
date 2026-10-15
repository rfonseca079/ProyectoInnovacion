# Tasks

## 1. Branch

- [x] 1.1 Create and switch to `feature/us-01-iniciar-sesion` before any code change, and verify `git status` shows that branch

## 2. Session and login screen

- [x] 2.1 Add the Express, Prisma, and Vite app skeleton with `Teacher` and a development-only seed, and verify `npm test` in `backend/` can load the Prisma test database
- [x] 2.2 Implement `POST /api/auth/login` and `GET /api/auth/me` with the 400 and identical 401 messages from the spec, and verify a Jest test rejects unknown email and wrong password with the same body and omits `passwordHash`
- [x] 2.3 Add `LoginPage` and the route guard at desktop width, and verify a Testing Library test shows Entrar and does not show registration or recovery
- [x] 2.4 Document the login responses in `docs/api-spec.yml` if the implementation adjusts them, and verify the documented status codes match the tests

## 3. Mandatory verification

- [x] 3.1 Review existing unit tests for auth and update them so the seeded-teacher cases are covered, and verify the targeted Jest file passes
- [x] 3.2 Run the backend and frontend unit suites, compare the test database before and after, and write `openspec/changes/us-01-iniciar-sesion/specs/teacher-login/reports/` with the dated unit-test and database report
- [x] 3.3 Call login with curl for empty fields, a wrong password, and Juanita's seeded password, and verify the status codes and Spanish messages
- [x] 3.4 Run a Playwright check at 1440px for Juanita signing in and refreshing, and verify she lands on her plan list
- [x] 3.5 Update `docs/data-model.md` for the session and teacher fields this change actually added, and verify the field names match `schema.prisma`

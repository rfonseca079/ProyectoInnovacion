# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-02-cerrar-sesion` before any code change, and verify `git status` shows that branch

## 2. Logout

- [x] 2.1 Implement `POST /api/auth/logout` so it deletes the server session and expires the cookie, and verify a Jest test gets 401 from the next authenticated request while the teacher's plan row remains
- [x] 2.2 Add Cerrar sesión on the list and wizard header, clear client state, and navigate to login, and verify a Testing Library test renders the control only when a session exists
- [x] 2.3 Keep the logout route aligned with `docs/api-spec.yml`, and verify the documented response is 204

## 3. Mandatory verification

- [x] 3.1 Review auth unit tests and add the case that a saved plan survives logout, and verify that test passes
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-02-cerrar-sesion/specs/teacher-logout/reports/`
- [x] 3.3 Call logout with curl using a valid session cookie, then call `/api/auth/me`, and verify 204 followed by 401
- [x] 3.4 Run Playwright for logout, browser Back, and refresh, and verify the login screen stays in place
- [x] 3.5 Update `docs/development_guide.md` only if the logout cookie name or path changed, and verify the guide matches the route

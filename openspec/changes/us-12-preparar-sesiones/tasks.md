# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-12-preparar-sesiones` before any code change, and verify `git status` shows that branch

## 2. Sessions

- [ ] 2.1 Seed five sessions for weeks 1 through 4 and three sets for the active week, and verify Monday and Wednesday of mathematics week 2 start expanded
- [ ] 2.2 Implement `generate-week-sessions` and `duplicate-structure`, including 409 when nothing is expanded, and verify duplicate keeps the other sessions' dates
- [ ] 2.3 Require learning, start, development, and close before continue, then set `READY_FOR_DELIVERY`, and verify that status in Jest
- [ ] 2.4 Build `SessionsStepPage` and request the week PDF, and verify the component shows two expanded sessions
- [ ] 2.5 Document `GET /api/plans/{planId}/weeks/{weekNumber}/pdf` in `docs/api-spec.yml`, and verify the filename pattern matches the spec

## 3. Mandatory verification

- [ ] 3.1 Review session tests for the Thursday plan B note, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-12-preparar-sesiones/specs/week-sessions/reports/`
- [ ] 3.3 Generate sessions with curl and verify five sessions return with status suggested
- [ ] 3.4 Run Playwright on the week selector and expand a collapsed session, and verify its date stays in that week
- [ ] 3.5 Update `docs/data-model.md` `Session` if a field was added, and verify homework remains optional

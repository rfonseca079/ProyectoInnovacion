# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-05-guardar-borrador` before any code change, and verify `git status` shows that branch

## 2. Autosave

- [x] 2.1 Implement `PATCH /api/plans/:planId` for a partial body and `updatedAt`, and verify a Jest test returns 404 for another teacher and a newer timestamp for the owner
- [x] 2.2 Save on blur, accept, edit, and step change from the client, and verify a component test shows "Borrador guardado automáticamente" after a successful response
- [x] 2.3 On a failed response, keep the typed value and show the failure sentence, and verify a component test does not clear the input
- [x] 2.4 Reopen from `currentStep` and stored blocks, and verify an API test returns the patched text
- [x] 2.5 Note the patch fields in `docs/api-spec.yml` under `PlanPatch`, and verify the documented trigger list matches US-05

## 3. Mandatory verification

- [x] 3.1 Review plan update tests so rubric and toggle patches are included, and verify they pass
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-05-guardar-borrador/specs/plan-autosave/reports/`
- [x] 3.3 Patch a field with curl and read the plan again, and verify the new value and `updatedAt`
- [x] 3.4 Run Playwright that edits a field, reloads, and checks the value, and verify the footer success text appeared before reload
- [x] 3.5 Update `docs/development_guide.md` only if a new environment flag is required for saves, and verify no secret was added

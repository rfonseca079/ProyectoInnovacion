# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-15-ajustar-despues-de-la-clase` before any code change, and verify `git status` shows that branch

## 2. Post-class adjustment

- [ ] 2.1 Seed `adjustment-week` for the three scenarios and leave María unapplied, and verify her plan opens on step 8 with the flag false
- [ ] 2.2 Implement apply inside one transaction so the Tuesday session and MEP strategy change, status becomes `ADJUSTED`, and a second apply does not add rows, and verify those Jest cases
- [ ] 2.3 Use an edited card body instead of the base string, and verify that override test
- [ ] 2.4 Save the notification toggle without sending a message, and verify no outbound mail or HTTP call is made
- [ ] 2.5 Build `AdjustmentStepPage` and the return notice "Aún no hay ajustes aplicados.", and verify the component test
- [ ] 2.6 Document `POST /api/plans/{planId}/adjustments/apply` in `docs/api-spec.yml`, and verify the status values include `ADJUSTED`

## 3. Mandatory verification

- [ ] 3.1 Review adjustment tests for the mathematics Tuesday sentences, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-15-ajustar-despues-de-la-clase/specs/post-class-adjustment/reports/`
- [ ] 3.3 Apply with curl and read the MEP row, and verify the retake strategy is stored
- [ ] 3.4 Run Playwright as María, apply, and open step 7, and verify the updated strategy is visible
- [ ] 3.5 Update `docs/data-model.md` for `adjustmentApplied` and `notifyEvaluationChanges`, and verify the default is false

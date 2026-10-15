# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-07-revisar-programa-y-calendario` before any code change, and verify `git status` shows that branch

## 2. Program and calendar

- [ ] 2.1 Seed calendar days and three variants for the step 1 blocks, and verify a Jest test finds 6 March suspended and the variant 3 community-problem sentence
- [ ] 2.2 Implement `reanalyze-program` so three calls return to variant 1, and verify that test
- [ ] 2.3 Build `ProgramStepPage` with the legend and three cards, and verify a component test blocks Continuar when a card is empty
- [ ] 2.4 Save time and restriction edits through the plan patch, and verify the API returns the edited restriction text
- [ ] 2.5 Record the block keys in `docs/data-model.md`, and verify they match the seed

## 3. Mandatory verification

- [ ] 3.1 Review step 1 tests for the Spanish and science signature extracts, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-07-revisar-programa-y-calendario/specs/program-and-calendar/reports/`
- [ ] 3.3 Call `reanalyze-program` with curl and verify the extract axis changes to the number-line variant
- [ ] 3.4 Run Playwright on step 1 and check the four legend labels, and verify no network call goes to a language-model host
- [ ] 3.5 Update `docs/api-spec.yml` if the action key differs from `reanalyze-program`, and verify the key is the one the button calls

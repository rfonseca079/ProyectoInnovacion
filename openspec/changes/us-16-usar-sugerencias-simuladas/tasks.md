# Tasks

## 1. Branch

- [ ] 1.1 Create and switch to `feature/us-16-usar-sugerencias-simuladas` before any code change, and verify `git status` shows that branch

## 2. Simulated suggestions

- [ ] 2.1 Create `SuggestionVariant` with three variants for every regenerable block and seed them, and verify a count test for the mathematics extract
- [ ] 2.2 Implement accept, edit, and regenerate, and verify regenerate does not replace an `EDITED` body while a named action does
- [ ] 2.3 Resolve the scenario by year, subject, grade, and month, set the fallback flag, and reload only `SUGGESTED` blocks, and verify the Estudios Sociales Jest case
- [ ] 2.4 Build `SuggestionCard` without a chat panel and with the fallback sentence, and verify the component test
- [ ] 2.5 Add a test that fails if application code imports a language-model SDK, and verify that test passes on the current dependencies
- [ ] 2.6 Align block and action keys in `docs/api-spec.yml` and `docs/data-model.md`, and verify each named button in the stories has a key

## 3. Mandatory verification

- [ ] 3.1 Review suggestion tests for the 1-2-3-1 cycle and the missing-variant message, and verify they pass
- [ ] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-16-usar-sugerencias-simuladas/specs/simulated-suggestions/reports/`
- [ ] 3.3 Regenerate a block with curl three times, and verify the fourth response is variant 1
- [ ] 3.4 Run Playwright on one Regenerar control, and verify the card text changes to the next stored sentence
- [ ] 3.5 Update `docs/backend-standards.md` if a new action key was introduced, and verify the no-LLM rule is still stated

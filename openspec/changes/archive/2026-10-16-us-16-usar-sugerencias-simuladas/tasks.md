# Tasks

## 1. Branch

- [x] 1.1 Create and switch to `feature/us-16-usar-sugerencias-simuladas` before any code change, and verify `git status` shows that branch

## 2. Simulated suggestions

- [x] 2.1 Write the failing count test that `SuggestionVariant` has three variants for every regenerable block in the mathematics extract. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code, including the schema and the seed, in this task. Mark complete only after that failure has been observed.
- [x] 2.2 Create `SuggestionVariant` and seed three variants for every regenerable block so the test from 2.1 passes. Run that same test and record the pass. Do not start this task until 2.1 is checked.

- [x] 2.3 Write the failing tests that accept, edit, and regenerate work, and that regenerate does not replace an `EDITED` body while a named action does. Run them and record the command, each test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after those failures have been observed.
- [x] 2.4 Implement accept, edit, and regenerate so the tests from 2.3 pass. Run those same tests and record the pass. Do not start this task until 2.3 is checked.

- [x] 2.5 Write the failing Estudios Sociales Jest case that resolves the scenario by year, subject, grade, and month, sets the fallback flag, and reloads only `SUGGESTED` blocks. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.6 Implement that scenario resolution so the test from 2.5 passes. Run that same test and record the pass. Do not start this task until 2.5 is checked.

- [x] 2.7 Write the failing component test that `SuggestionCard` has no chat panel and shows the fallback sentence. Run it and record the command, the test name, and the assertion or error that failed. Do not add or edit production code in this task. Mark complete only after that failure has been observed.
- [x] 2.8 Build `SuggestionCard` so the test from 2.7 passes. Run that same test and record the pass. Do not start this task until 2.7 is checked.

- [x] 2.9 Add a test that fails if application code imports a language-model SDK. Run it against the current dependencies and record the pass. Do not add a language-model package, and do not weaken the test to produce an artificial failure. This guard already matches the current code, so it is not a red-then-green feature task.

- [x] 2.10 Align block and action keys in `docs/api-spec.yml` and `docs/data-model.md`, and verify each named button in the stories has a key

- [x] 2.11 Write the failing tests that a card shows Sugerido por IA, Aceptada, or Editada, and that an unchanged blur does not save. Run them and record the failure. Do not edit production code in this task.
- [x] 2.12 Show those Spanish states on `SuggestionCard` and ignore an unchanged blur, so the tests from 2.11 pass. Pass: `npx vitest run src/components/SuggestionCard.test.tsx` — "shows the Spanish state and ignores an unchanged blur".

- [x] 2.13 Write the failing test that accept after regenerate and reload stores the current variant, while accept without regenerate keeps the edited text. Run it and record the failure. Do not edit production code in this task.
- [x] 2.14 Persist that pending variant on the block and apply it on accept, including after reload, so the test from 2.13 passes. Pass: `npx jest --runInBand --forceExit tests/suggestionActions.test.ts -t "stores the current variant|keeps an edited body when accept"`.

- [x] 2.15 Write the failing test that Regenerar shows "No hay otra sugerencia guardada para este bloque." on the step, and that a named action without a stored variant uses that same sentence. Run them and record the failure. Do not edit production code in this task.
- [x] 2.16 Show that sentence for Regenerar and for named actions, so the tests from 2.15 pass. Pass: `npx vitest run src/pages/ProgramStepPage.test.tsx` and `npx jest --runInBand --forceExit tests/suggestionActions.test.ts -t "missing-suggestion sentence"`.

- [x] 2.17 Write the failing test that generating sessions for mathematics week 1 loads the next stored set. Run it and record the failure. Do not edit production code in this task.
- [x] 2.18 Create a plan block for every week from variant 1 so the test from 2.17 passes. Pass: `npx jest --runInBand --forceExit tests/sessions.test.ts -t "loads the stored set"`.

## 3. Mandatory verification

- [x] 3.1 Review suggestion tests for the 1-2-3-1 cycle and the missing-variant message, and verify they pass. This review does not replace the failing-test tasks above.
- [x] 3.2 Run the unit suites, compare the test database before and after, and write the dated report under `openspec/changes/us-16-usar-sugerencias-simuladas/specs/simulated-suggestions/reports/`
- [x] 3.3 Regenerate a block with curl three times, and verify the fourth response is variant 1
- [x] 3.4 Run Playwright on one Regenerar control, and verify the card text changes to the next stored sentence
- [x] 3.5 Update `docs/backend-standards.md` if a new action key was introduced, and verify the no-LLM rule is still stated

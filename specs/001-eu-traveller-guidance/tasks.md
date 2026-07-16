# Tasks: EU Traveller Guidance

**Input**: Design documents from `/specs/001-eu-traveller-guidance/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/rules-and-config-contract.md, quickstart.md

**Constitution compliance**: All tasks respect MVP Discipline. No tasks exist for authentication, user accounts, admin portals, databases, Shopper Portal integration, image/document upload, or backend APIs.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable — different files, no incomplete-task dependency
- **[US1]**, **[US2]**, **[US3]**: User story this task belongs to

---

## Phase 1: Project Setup

**Purpose**: Initialize the project toolchain, configuration, and folder structure so all subsequent phases can build on a stable, consistent foundation.

- [ ] T001 Scaffold Vite + React 18 + TypeScript 5.x project with `npm create vite` and confirm build output in `dist/`
- [ ] T002 Configure absolute path aliases in `vite.config.ts` to match the `src/` module structure defined in plan.md
- [ ] T003 [P] Add ESLint and Prettier configuration files (`.eslintrc.cjs`, `.prettierrc`) aligned with TypeScript and React rules
- [ ] T004 [P] Create `.gitignore` covering `node_modules/`, `dist/`, `.env*`, and build artefacts
- [ ] T005 Add React Router and configure top-level routing scaffold in `src/app/routes/index.tsx`
- [ ] T006 [P] Create directory skeleton for all modules — `src/journey/`, `src/rules/`, `src/config/`, `src/i18n/`, `src/analytics/adapters/`, `src/app/screens/`, `src/app/components/`, `src/utils/` — with empty `index.ts` placeholder files
- [ ] T007 [P] Create `public/config/` and `public/locales/` directories with empty placeholder files
- [ ] T008 Configure Vitest in `vite.config.ts` and create `tests/unit/`, `tests/integration/`, `tests/contract/`, `tests/e2e/` directories

---

## Phase 2: Foundational — Configuration and Rules Engine

**Purpose**: Deliver the core infrastructure that all user-story phases depend on — schema validation, the rules engine, outcome/reason code contracts, and country config loading. No user-story work should begin before this phase is complete.

- [X] T009 Define outcome code enum `KEEP_FORM | SEND_FORM` and reason code enum in `src/rules/outcome-codes.ts` and `src/rules/reason-codes.ts`
- [X] T010 [P] Define `RuleInput`, `RulesConfig`, and `RuleResult` TypeScript types in `src/rules/engine.ts` matching the contract in `contracts/rules-and-config-contract.md`
- [X] T011 Implement `evaluateOutcome(input, config): RuleResult` in `src/rules/engine.ts` with exact precedence order from plan.md:
  - Rule 1: non-digital issuing country → `SEND_FORM / SEND_FORM_NON_DIGITAL_ISSUING_COUNTRY`
  - Rule 2: cross-border departure → `SEND_FORM / SEND_FORM_CROSS_BORDER_DEPARTURE`
  - Rule 3: same country with digital → `KEEP_FORM / KEEP_FORM_DIGITAL_SAME_COUNTRY`
  - Rule 4: unsupported/missing route fallback → `SEND_FORM / SEND_FORM_UNSUPPORTED_ROUTE`
- [X] T012 Document precedence order with inline comments in `src/rules/precedence.ts` and export a human-readable `RULE_PRECEDENCE` constant for test assertions
- [X] T013 [P] Define Zod schema for `RulesConfig` in `src/config/country-rules.schema.ts`
- [X] T014 [P] Define Zod schema for app configuration in `src/config/app-config.schema.ts`
- [X] T015 Implement config loader in `src/config/loader.ts` that fetches `public/config/country-rules.v1.json`, validates it against the Zod schema, and falls back to `SEND_FORM / SEND_FORM_UNSUPPORTED_ROUTE` on failure with a non-blocking diagnostic log
- [X] T016 Author initial `public/config/country-rules.v1.json` with a representative set of EU countries, at least one with `supportsDigitalValidation: true` and one with `false`, matching the contract shape from `contracts/rules-and-config-contract.md`
- [X] T017 [P] Author initial `public/config/app-config.v1.json` with app-level metadata (version, supported locales list)

**Checkpoint**: Rules engine, config schema, and config loader can be imported and evaluated in isolation before any UI or i18n work begins.

---

## Phase 3: User Story 1 — Fast Guidance for Travellers (Priority: P1) 🎯 MVP

**Goal**: A traveller opens the app on a smartphone, selects their language, answers the two required country questions, and receives the correct single instruction.

**Independent Test**: Open the app → select any launch language → select issuing country → select departure country → verify exactly one instruction appears and matches the expected outcome for the selected country pair.

### Journey State Management

- [X] T018 [US1] Define `TravellerJourney` state shape in `src/journey/state.ts` matching `data-model.md` (journeyId, startedAt, completedAt, sourceType, selectedLanguage, issuingCountryCode, departureCountryCode, outcomeCode, reasonCode, completionStatus, completionDurationMs)
- [X] T019 [US1] Implement journey state reducer in `src/journey/reducer.ts` covering transitions: `START_JOURNEY`, `SELECT_LANGUAGE`, `SET_ISSUING_COUNTRY`, `SET_DEPARTURE_COUNTRY`, `COMPLETE_JOURNEY`, `ABANDON_JOURNEY`
- [X] T020 [US1] Implement selectors in `src/journey/selectors.ts`: `isReadyForRuleEvaluation`, `isCompleted`, `getOutcome`

### Language Selection Screen

- [X] T021 [US1] Create `src/app/screens/LanguageSelectionScreen.tsx` rendering a list of the six launch locales (`en`, `es`, `pt`, `zh`, `ar`, `tr`) sourced from app config, with no hard-coded labels
- [X] T022 [US1] Wire language selection to `src/journey/reducer.ts` dispatch (`SELECT_LANGUAGE`) and persist selection to `localStorage`
- [X] T023 [US1] Apply `document.dir = 'rtl'` and relevant CSS direction class when `ar` is the active locale; `ltr` for all others, implemented in `src/i18n/direction.ts`

### Country Question Screens

- [X] T024 [US1] Create `src/app/screens/IssuingCountryScreen.tsx` rendering a mobile-friendly country selector (list or searchable select) whose options come from active `countries` in config; country display names resolved from `i18n` by ISO code
- [X] T025 [US1] Create `src/app/screens/DepartureCountryScreen.tsx` with the same pattern as T024
- [X] T026 [US1] Wire both screens to journey reducer actions and to React Router flow so the sequence is: language → issuing country → departure country → outcome

### Outcome Screen

- [X] T027 [US1] Create `src/app/screens/OutcomeScreen.tsx` that calls `evaluateOutcome` with current journey state and resolved config, then displays exactly one localised instruction from `i18n` keyed on `outcomeCode`
- [X] T028 [US1] Ensure `OutcomeScreen` never renders both `KEEP_FORM` and `SEND_FORM` labels simultaneously (FR-005)

**Checkpoint**: Full journey from language selection through outcome screen is independently testable on a mobile viewport.

---

## Phase 4: User Story 2 — Clear Final Action (Priority: P2)

**Goal**: The outcome screen is unambiguous, confidence-inspiring, and follows the Figma layout baseline and accessibility standards.

**Independent Test**: For every outcome code, verify exactly one action label appears; verify WCAG contrast, keyboard focus, and screen-reader content on the outcome screen.

### Outcome Screen Polish

- [ ] T029 [P] [US2] Style `OutcomeScreen` for mobile-first layout following Figma baseline; ensure the instruction is the dominant visual element
- [ ] T030 [P] [US2] Add a clear visual distinction between `KEEP_FORM` and `SEND_FORM` outcomes (e.g., icon, colour class) using only configurable or CSS-class-based theming — no hard-coded colours in TypeScript
- [ ] T031 [US2] Add unit test in `tests/unit/OutcomeScreen.test.tsx` asserting that neither outcome code renders content belonging to the other (single-outcome invariant)

### Accessibility Baseline

- [ ] T032 [P] [US2] Audit all screens for semantic HTML: `<main>`, `<h1>`, `<button>`, `<label>`, `<select>` elements used correctly; no `<div>` used as interactive control
- [ ] T033 [P] [US2] Verify colour contrast ≥ 4.5:1 for all text/background pairs against Figma design tokens; document any exceptions with a justification comment
- [ ] T034 [P] [US2] Add `aria-label` / `aria-describedby` to all interactive elements in country selector screens

**Checkpoint**: Outcome screen is independently verifiable for single-outcome behaviour and accessibility baseline.

---

## Phase 5: User Story 3 — Configurable Rules and Measurement (Priority: P3)

**Goal**: Business team can update country rules config without code changes; analytics capture all required events so paper form return impact is measurable.

**Independent Test**: Edit `public/config/country-rules.v1.json` to toggle a country's `supportsDigitalValidation`; verify outcome changes on next journey without any source code edit. Verify analytics events fire for started, completed, and abandoned journeys.

### Analytics Implementation

- [ ] T035 [US3] Define `AnalyticsAdapter` interface in `src/analytics/adapters/types.ts` with method signatures: `track(event: AnalyticsEvent): void`
- [ ] T036 [US3] Define `AnalyticsEvent` union type in `src/analytics/events.ts` covering `JOURNEY_STARTED`, `QUESTION_ANSWERED`, `JOURNEY_COMPLETED`, `JOURNEY_ABANDONED` with required payload fields per plan.md section 6
- [ ] T037 [US3] Implement `NoopAnalyticsAdapter` in `src/analytics/adapters/noop.ts` as the default MVP adapter
- [ ] T038 [US3] Implement `tracker.ts` in `src/analytics/` that accepts an injected `AnalyticsAdapter` and exposes typed `trackJourneyStarted`, `trackQuestionAnswered`, `trackJourneyCompleted`, `trackJourneyAbandoned` methods
- [ ] T039 [US3] Fire `JOURNEY_STARTED` event from journey reducer on `START_JOURNEY` action; include `journeyId`, `sourceType`, `selectedLanguage`, and timestamp
- [ ] T040 [US3] Fire `QUESTION_ANSWERED` event after issuing and departure country selections; include `journeyId`, field name, and ISO country code — no personal data
- [ ] T041 [US3] Fire `JOURNEY_COMPLETED` event from `OutcomeScreen` on mount when `completionStatus = COMPLETED`; include full payload from plan.md section 6
- [ ] T042 [US3] Fire `JOURNEY_ABANDONED` event on route change away from an in-progress journey before outcome is shown; include `journeyId`, partial `issuingCountryCode`, `departureCountryCode`, and `selectedLanguage`

### Config Updateability Validation

- [ ] T043 [P] [US3] Add integration test in `tests/integration/config-update.test.ts` that loads a modified `country-rules.v1.json` fixture, runs `evaluateOutcome`, and asserts the outcome changes to match the new config — no source code modification required

**Checkpoint**: Analytics fires for all four events; config change produces updated outcome without UI code changes.

---

## Phase 6: Internationalisation

**Purpose**: Ensure all six launch locales are complete, all traveller-facing text is sourced from locale files, and Arabic RTL rendering is validated.

- [ ] T044 Author English (`en`) locale file at `public/locales/en.json` with all required keys from the localisation contract: `labels.issuingCountryPrompt`, `labels.departureCountryPrompt`, `labels.nextAction`, `outcomes.KEEP_FORM`, `outcomes.SEND_FORM`, `errors.configurationUnavailable`, and country display names for all active config countries
- [ ] T045 [P] Author `es`, `pt`, `zh`, `ar`, `tr` locale files at `public/locales/{locale}.json` with equivalent key coverage as English
- [ ] T046 Configure i18next in `src/i18n/index.ts` and locale loader in `src/i18n/locale-loader.ts`; validate language detection and persistence across navigation
- [ ] T047 Add locale completeness check in `tests/contract/locale-completeness.test.ts` that loads all six locale files and asserts every required key present in `en.json` also exists in each other locale
- [ ] T048 Add missing-key fallback test: assert that when a translation key is absent, the app shows a defined fallback string (not a raw key or empty string), per `errors.configurationUnavailable` contract
- [ ] T049 Add RTL direction test in `tests/unit/direction.test.ts`: assert that `document.dir` is `rtl` when locale is `ar` and `ltr` for all other launch locales
- [ ] T050 Add E2E smoke test in `tests/e2e/rtl-arabic.spec.ts` (Playwright) that loads the app with `?lng=ar`, verifies `document.dir === 'rtl'`, completes a journey, and asserts the outcome text is not empty

---

## Phase 7: QR Entry

**Purpose**: Support QR-driven attribution and entry without any backend dependency.

- [ ] T051 Implement QR URL parameter handling in `src/app/routes/index.tsx`: detect `?entry=qr` on app load and set `sourceType = QR` on the journey state
- [ ] T052 Implement optional source/campaign attribution parameter handling: extract recognised query params and attach to `JOURNEY_STARTED` analytics payload; assert they have no effect on rules evaluation
- [ ] T053 Add unit test in `tests/unit/qr-entry.test.ts` asserting that QR query params change `sourceType` in analytics but leave `evaluateOutcome` output identical to a DIRECT-sourced journey with the same country inputs

---

## Phase 8: Testing and Validation

**Purpose**: Deliver comprehensive rule precedence, config schema, localisation, analytics, and mobile E2E coverage.

### Rule Precedence Contract Tests

- [ ] T054 [P] Add contract test `tests/contract/rules-precedence.test.ts` covering all four rule branches:
  - Non-digital issuing country → asserts `SEND_FORM / SEND_FORM_NON_DIGITAL_ISSUING_COUNTRY`
  - Cross-border departure (both countries digital) → asserts `SEND_FORM / SEND_FORM_CROSS_BORDER_DEPARTURE`
  - Same country, digital → asserts `KEEP_FORM / KEEP_FORM_DIGITAL_SAME_COUNTRY`
  - Missing/null config → asserts `SEND_FORM / SEND_FORM_UNSUPPORTED_ROUTE`
- [ ] T055 [P] Add determinism test: call `evaluateOutcome` 100 times with identical inputs; assert all results are identical

### Config Schema Validation Tests

- [ ] T056 [P] Add schema validation tests in `tests/contract/config-schema.test.ts`:
  - Valid config passes Zod schema
  - Missing `countryCode` field causes validation failure
  - Duplicate `countryCode` values cause validation failure
  - Missing `supportsDigitalValidation` causes validation failure
  - Invalid config triggers fail-safe: outcome is `SEND_FORM / SEND_FORM_UNSUPPORTED_ROUTE`

### Analytics Event Tests

- [ ] T057 [P] Add unit tests in `tests/unit/analytics-tracker.test.ts` asserting each tracker method calls the injected adapter with a payload that includes all required fields and excludes personal data fields
- [ ] T058 [P] Add integration test that stubs `NoopAnalyticsAdapter` with a spy and runs a full journey; assert `JOURNEY_STARTED`, `QUESTION_ANSWERED` (×2), `JOURNEY_COMPLETED` fire in order with correct data

### Mobile E2E Tests

- [ ] T059 Add Playwright E2E test `tests/e2e/journey-keep-form.spec.ts`: mobile viewport, select English, same-country digital pair → verify outcome label matches `outcomes.KEEP_FORM` locale value
- [ ] T060 [P] Add Playwright E2E test `tests/e2e/journey-send-form-cross-border.spec.ts`: cross-border country pair → verify `SEND_FORM` outcome
- [ ] T061 [P] Add Playwright E2E test `tests/e2e/journey-send-form-non-digital.spec.ts`: non-digital issuing country → verify `SEND_FORM` regardless of departure country
- [ ] T062 [P] Add Playwright E2E test `tests/e2e/single-outcome-invariant.spec.ts`: verify the outcome screen never renders both `outcomes.KEEP_FORM` and `outcomes.SEND_FORM` text simultaneously across all outcomes
- [ ] T063 [P] Add Playwright E2E test `tests/e2e/journey-qr-entry.spec.ts`: load with `?entry=qr`, complete journey, verify `sourceType = QR` in analytics spy and outcome is unchanged

---

## Phase 9: Accessibility and RTL Verification

**Purpose**: Validate accessibility standards and Arabic RTL behaviour across the full journey flow.

- [ ] T064 Run automated accessibility audit (e.g., axe-core via `@axe-core/playwright`) across all journey screens on mobile viewport; assert zero critical violations in `tests/e2e/accessibility.spec.ts`
- [ ] T065 [P] Verify keyboard navigation: Tab order follows visual flow; Enter/Space activates controls; focus is visible on all interactive elements — cover all four screens
- [ ] T066 [P] Verify screen reader–compatible markup: each screen has a single `<h1>`, all form elements have associated `<label>`, and outcome instruction text is within an appropriate landmark region
- [ ] T067 Add Arabic RTL layout test in `tests/e2e/rtl-arabic.spec.ts` (extend T050): step through all four screens, capture screenshots at each step, and assert no text overflow or layout collapse on a 375 px mobile viewport
- [ ] T068 [P] Verify logical CSS properties are used in RTL-sensitive components (`src/app/components/`, `src/app/screens/`); add a lint rule or manual review checklist entry to prevent introducing `margin-left`/`margin-right` absolute offsets

---

## Phase 10: Polish and Pre-Launch Readiness

**Purpose**: Final quality and readiness checks before task list is considered complete.

- [ ] T069 Performance budget: run Lighthouse mobile audit on production build; assert First Contentful Paint < 2 s and journey can reach outcome screen within 30 s on simulated 4G
- [ ] T070 [P] Verify no traveller-facing string is hard-coded in any `.tsx` or `.ts` source file outside `public/locales/`; add grep/lint check to CI pipeline
- [ ] T071 [P] Verify all `public/config/` JSON files are schema-valid on CI using the Zod schemas from `src/config/`
- [ ] T072 [P] Add `README.md` documenting project structure, how to add a new language, how to update country rules config, and how to add a new analytics provider
- [ ] T073 Run full quickstart validation from `quickstart.md` across all six scenarios (same-country keep, cross-border send, non-digital send, localisation coverage, config update, QR entry)

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Requires Phase 1 — BLOCKS all user-story phases
- **Phase 3 (US1)**: Requires Phase 2 complete
- **Phase 4 (US2)**: Requires Phase 3 complete
- **Phase 5 (US3)**: Requires Phase 2 complete; can run in parallel with Phase 4
- **Phase 6 (i18n)**: Requires Phase 3 UI screens (T021–T026) to be complete
- **Phase 7 (QR)**: Requires Phase 2 complete; can run in parallel with Phase 3
- **Phase 8 (Testing)**: Rule and config tests (T054–T056) require Phase 2; journey E2E (T059–T063) require Phase 3–5
- **Phase 9 (Accessibility/RTL)**: Requires Phases 3–6 complete
- **Phase 10 (Polish)**: Requires all prior phases complete

### Critical Path

Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 9 → Phase 10

### Parallel Opportunities

- Phase 5 analytics work runs alongside Phase 4 once Phase 2 is complete
- Phase 6 locale file authoring (T044, T045) can begin alongside Phase 3 UI work
- Phase 7 QR work runs alongside Phase 3 once Phase 2 is complete
- Phase 8 contract and schema tests (T054–T056) can begin immediately after Phase 2
- All tasks marked [P] within a phase run independently

---

## Parallel Example: Phase 2

```text
After T009 (codes defined), start in parallel:
  T010 — type definitions
  T013 — country-rules Zod schema
  T014 — app-config Zod schema

After T013 + T014 complete:
  T015 — config loader (depends on schemas)

After T011 + T015 complete:
  T016 — country-rules.v1.json (depends on schema and engine)
```

---

## Implementation Strategy

### MVP Scope (Phases 1–3 + Phase 6 + Phase 7)

1. Complete Phase 1: Setup
2. Complete Phase 2: Config, rules engine, and config loader
3. Complete Phase 3: Language selection → country questions → outcome (US1)
4. Complete Phase 6: All six locale files and i18n wiring
5. Complete Phase 7: QR entry detection
6. **Stop and validate**: End-to-end journey on mobile, all locales, QR attribution
7. Deploy MVP

### Incremental Delivery

- After Phase 3: Validated traveller guidance MVP (P1 user story complete)
- After Phase 4: Accessible, Figma-aligned outcome screen (P2 complete)
- After Phase 5: Config-driven rules and analytics measurement (P3 complete)
- After Phases 8–10: Full test coverage, accessibility verified, launch-ready

---

## Notes

- [P] tasks are parallelizable because they affect different files with no dependency on incomplete tasks
- [USn] labels map tasks to user stories for traceability
- No task introduces authentication, user accounts, admin portals, databases, Shopper Portal integration, image upload, document upload, or backend APIs — Constitution principle XII is enforced throughout
- Any future scope addition must follow the Constitution amendment procedure before new tasks are added

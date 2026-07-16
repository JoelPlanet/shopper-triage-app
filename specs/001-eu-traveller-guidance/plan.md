# Implementation Plan: EU Traveller Guidance

**Branch**: `[001-eu-traveller-guidance]` | **Date**: 2026-07-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-eu-traveller-guidance/spec.md`

## Summary

Deliver a mobile-first static web application that guides travellers to one clear final instruction before EU departure. The implementation is configuration-driven, localisation-first, accessibility-aware, and analytics-ready, with strict MVP scope control and no backend services.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: React 18, Vite 5, React Router, i18next + react-i18next, Zod

**Storage**: No backend storage; static JSON for country rules and app config; locale JSON resources; optional browser localStorage for language preference only

**Testing**: Vitest + Testing Library (unit/component), Playwright (mobile E2E), schema validation tests for configuration and locale resources

**Target Platform**: Modern mobile browsers (Safari iOS, Chrome Android), with responsive desktop fallback

**Project Type**: Static web SPA

**Performance Goals**: Primary journey completion under 30 seconds; first render under 2 seconds on mid-tier mobile over 4G

**Constraints**: No authentication, user accounts, admin portals, databases, backend APIs, Shopper Portal integration, image upload, or document upload in MVP

**Scale/Scope**: Guided journey with language selection, issuing/departure country questions, deterministic rules evaluation, single-outcome result, QR-driven entry attribution, and lightweight analytics events

## Constitution Alignment Check

- Traveller First: UI and logic prioritize clear final action and low-friction completion -> PASS
- Simplicity Over Complexity: Minimum-question flow with no non-essential branches -> PASS
- Mobile First and Fast Completion: Smartphone-first information hierarchy and constrained interaction depth -> PASS
- Clear Single Outcome: Exactly one final instruction per completed journey -> PASS
- Configuration Over Hard-Coding: Country validation behavior sourced from schema-validated config -> PASS
- Language-Independent Business Logic: Rules return outcome and reason codes only -> PASS
- Localisation First: All traveller-facing strings from locale resources with launch-language parity -> PASS
- Accessibility: Plain-language content and accessible interaction requirements included in scope -> PASS
- Data Minimisation: Analytics/event design excludes unnecessary personal data -> PASS
- Analytics Readiness: Event model covers completion, timing, route, language, outcome, and reason -> PASS
- MVP Discipline: No disallowed infrastructure introduced -> PASS
- Figma as UX Baseline: Figma governs journey flow, layout direction, and visual hierarchy -> PASS
- Maintainability: Modular architecture supports countries, rules, locales, analytics, and QR expansion -> PASS

## Architecture Decisions

### 1. Separation of Concerns

The implementation uses strict module boundaries:

- Presentation/UI: routes, screens, and components that render traveller-facing flow
- Journey state management: in-memory/session state for current journey progress and answers
- Rules engine: deterministic evaluation logic producing outcome and reason codes
- Country configuration: external JSON + Zod schema validation
- Localisation resources: locale files and runtime i18n loading
- Analytics: provider-agnostic adapter + event payload contracts
- Testing: unit, integration, contract, and mobile E2E suites

### 2. Rules Engine and Precedence

Rules must be evaluated in this exact order:

1. If issuing country does not support digital validation -> `SEND_FORM` with `SEND_FORM_NON_DIGITAL_ISSUING_COUNTRY`
2. Else if issuing country and departure country differ -> `SEND_FORM` with `SEND_FORM_CROSS_BORDER_DEPARTURE`
3. Else if issuing country and departure country are the same and issuing country supports digital validation -> `KEEP_FORM` with `KEEP_FORM_DIGITAL_SAME_COUNTRY`
4. Fallback for unsupported/missing configuration route -> `SEND_FORM` with `SEND_FORM_UNSUPPORTED_ROUTE`

Determinism rule: rules evaluation must always return one outcome code and one reason code.

### 3. Outcome and Reason Code Contracts

Internal code contracts:

- Outcome codes: `KEEP_FORM`, `SEND_FORM`
- Reason codes:
  - `KEEP_FORM_DIGITAL_SAME_COUNTRY`
  - `SEND_FORM_NON_DIGITAL_ISSUING_COUNTRY`
  - `SEND_FORM_CROSS_BORDER_DEPARTURE`
  - `SEND_FORM_UNSUPPORTED_ROUTE`

Traveller-facing messages are resolved from localisation resources, never embedded in rules logic.

### 4. Country Rules Configuration Model

Configuration requirements:

- Country identity uses stable ISO 3166-1 alpha-2 codes, not translated labels
- Country display names come from localisation resources by country code
- Digital validation status is configurable per country without UI code changes
- Configuration is schema-validated at load time

Proposed shape (high-level):

- `version`: semantic version string
- `defaultOutcomeCode`: `SEND_FORM`
- `countries[]`:
  - `countryCode`: ISO code
  - `supportsDigitalValidation`: boolean
  - `isActive`: boolean
- `routePolicies` (optional future-proof extension for unsupported routes)

Validation failure behavior: fail safe to `SEND_FORM` + `SEND_FORM_UNSUPPORTED_ROUTE`, and emit non-blocking diagnostics.

### 5. Localisation and RTL

Launch language list is fixed to:

- `en`
- `es`
- `pt`
- `zh`
- `ar`
- `tr`

Locale file structure:

```text
public/locales/
├── en.json
├── es.json
├── pt.json
├── zh.json
├── ar.json
└── tr.json
```

RTL requirements for Arabic (`ar`):

- Set document direction to `rtl` when `ar` is active
- Use logical CSS properties where possible (`margin-inline`, `padding-inline`, etc.)
- Mirror directional layout and iconography only where semantically required
- Validate mobile layouts and interaction flow in RTL during E2E and visual QA

### 6. Analytics Design

Required events:

- `JOURNEY_STARTED`
- `QUESTION_ANSWERED`
- `JOURNEY_COMPLETED`
- `JOURNEY_ABANDONED`

Required payload support:

- `issuingCountryCode`
- `departureCountryCode`
- `outcomeCode`
- `reasonCode`
- `selectedLanguage`
- `completionStatus`
- `completionDurationMs`

Data minimisation requirements:

- No unnecessary personal data fields
- No persistent user identity required for MVP analytics
- Journey-level ephemeral IDs may be used strictly for event correlation

Provider strategy:

- Define `AnalyticsAdapter` interface in `src/analytics/tracker.ts`
- Provide `NoopAnalyticsAdapter` placeholder for MVP/default local development
- Keep provider integration pluggable and optional until production provider selection

### 7. QR Entry Strategy

- QR codes open app at journey start route
- URL parameters may include optional source/campaign attribution
- Query parameters influence analytics attribution only, not core rules decisions
- No backend redirect or QR processing service is required

## Project Structure

### Documentation

```text
specs/001-eu-traveller-guidance/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code

```text
src/
├── app/
│   ├── routes/
│   ├── screens/
│   └── components/
├── journey/
│   ├── state.ts
│   ├── reducer.ts
│   └── selectors.ts
├── rules/
│   ├── engine.ts
│   ├── outcome-codes.ts
│   ├── reason-codes.ts
│   └── precedence.ts
├── config/
│   ├── country-rules.schema.ts
│   ├── app-config.schema.ts
│   └── loader.ts
├── i18n/
│   ├── index.ts
│   ├── locale-loader.ts
│   └── direction.ts
├── analytics/
│   ├── events.ts
│   ├── tracker.ts
│   └── adapters/
│       ├── noop.ts
│       └── types.ts
└── utils/

public/
├── config/
│   ├── country-rules.v1.json
│   └── app-config.v1.json
└── locales/
    ├── en.json
    ├── es.json
    ├── pt.json
    ├── zh.json
    ├── ar.json
    └── tr.json

tests/
├── unit/
├── integration/
├── contract/
└── e2e/
```

## MVP Scope Guardrails

The implementation plan explicitly excludes all of the following unless a Constitution-governed amendment is approved:

- Authentication
- User accounts
- Admin portals
- Databases
- Shopper Portal integration
- Image upload
- Document upload
- Backend APIs

Change governance rule:

Any proposal that introduces excluded scope must include written business justification, architecture impact, and approval trace before tasks are generated.

## Implementation Readiness and Tasking Inputs

This plan is final and implementation-ready for task generation.

Task generation must include:

- Contract tests for rule precedence and outcome/reason code determinism
- Schema tests for configuration validity and fail-safe behavior
- Localisation completeness checks for all six launch languages
- RTL behavior checks for Arabic
- Analytics event coverage tests for started, answered, completed, and abandoned journeys
- Mobile E2E coverage of single clear outcome behavior and QR-attributed entry

## Constitution Check (Post-Design)

- Architecture remains static SPA with no backend dependencies for MVP -> PASS
- Rules logic is deterministic, configuration-driven, and language-independent -> PASS
- Launch locales and RTL approach are fully specified -> PASS
- Analytics design is data-minimised and provider-agnostic -> PASS
- Disallowed MVP infrastructure remains excluded -> PASS

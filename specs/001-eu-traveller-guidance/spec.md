# Feature Specification: EU Traveller Guidance

**Feature Branch**: `[001-eu-traveller-guidance]`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "Build a mobile-first traveller guidance experience for international travellers leaving the EU, using configurable rules, minimal questions, clear accessibility, and analytics to reduce unnecessary paper form returns."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fast Guidance for Travellers (Priority: P1)

A traveller opens the app on a smartphone and answers only the questions needed to reach the correct departure instruction.

**Why this priority**: This is the primary traveller value and the core reason the app exists.

**Independent Test**: A traveller can start the journey, answer the minimum required questions, and reach a clear final instruction without any extra steps.

**Acceptance Scenarios**:

1. **Given** a traveller is starting from the home screen, **When** they answer the required questions, **Then** the app returns the correct single instruction for their situation.
2. **Given** the available rule set can determine the result from the initial answers, **When** the traveller completes the journey, **Then** no unnecessary follow-up questions are shown.

---

### User Story 2 - Clear Final Action (Priority: P2)

A traveller receives one unambiguous instruction at the end of the journey and knows exactly what to do next.

**Why this priority**: The traveller must leave with confidence and without having to interpret multiple possible actions.

**Independent Test**: A completed journey always ends in one of the two allowed instructions and never presents both at once.

**Acceptance Scenarios**:

1. **Given** a completed journey, **When** the result is shown, **Then** the traveller sees only one final instruction: either "Keep your form" or "Send your form to Planet".
2. **Given** a traveller reaches the end of the flow, **When** the instruction is displayed, **Then** no alternative action choice is shown on the same screen.

---

### User Story 3 - Configurable Business Rules and Measurement (Priority: P3)

The business team can change country validation and guidance rules without changing the traveller-facing journey, while the app records enough analytics to measure paper form reduction.

**Why this priority**: The rules will evolve, and the app must support measurable business outcomes without forcing redesigns.

**Independent Test**: A new rule set can be applied and the resulting traveller journey can be verified, while analytics still capture the journey outcome.

**Acceptance Scenarios**:

1. **Given** a changed country rule, **When** the traveller starts a new journey, **Then** the updated rule affects the outcome without altering the main journey structure.
2. **Given** a completed journey, **When** analytics are reviewed, **Then** the organization can see the journey outcome and completion timing needed to evaluate paper form reduction.

### Out of Scope

- Image upload and image download are excluded from this MVP and are handled by a separate downstream application.
- Shopper Portal integration is excluded from this MVP.

### Edge Cases

- A traveller provides incomplete information and the app must decide whether another question is truly needed.
- Two rules appear to conflict and the app must still produce one clear instruction.
- The traveller is in a noisy or time-pressured context and needs very short, plain-language prompts.
- A country or route is not yet covered by the current rules and the app must handle the gap without exposing confusing options.
- A traveller abandons the journey before completion and the app should not treat that as a final instruction.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST prioritize a mobile-first experience suitable for travellers using a smartphone in-store, in transit, or at the airport.
- **FR-002**: The app MUST ask the minimum number of questions required to determine the correct traveller outcome.
- **FR-003**: The app MUST introduce additional questions only when they materially improve decision accuracy.
- **FR-004**: Every completed traveller journey MUST end with exactly one unambiguous instruction: "Keep your form" or "Send your form to Planet".
- **FR-005**: The app MUST NOT present multiple possible final actions simultaneously.
- **FR-006**: The app MUST ask the traveller for the country where their tax free form was issued.
- **FR-007**: The app MUST ask the traveller for the EU country they are departing from.
- **FR-008**: The app MUST evaluate the relationship between the issuing country and the departure country to determine the outcome.
- **FR-009**: When the issuing country and departure country are the same and the issuing country supports digital validation, the app MUST return "Keep your form".
- **FR-010**: When the issuing country and departure country differ, the app MUST return "Send your form to Planet".
- **FR-011**: When the issuing country does not support digital validation, the app MUST return "Send your form to Planet" regardless of departure country.
- **FR-012**: The digital validation status for each country MUST be maintained in configuration and MUST NOT be hard-coded into traveller-facing screens.
- **FR-013**: Country validation rules must be maintained in external configuration and updated without changes to application source code.
- **FR-014**: The app MUST use configurable business and country validation rules rather than hard-coding validation logic into the traveller-facing experience.
- **FR-015**: Any traveller requiring manual validation MUST receive the instruction "Send your form to Planet".
- **FR-016**: The app MUST support entry through QR codes printed on physical traveller materials.
- **FR-017**: The MVP must support multiple languages at launch. The languages to be used for launch will: English, Spanish, Portuguese, Chinese, Arabic, Turkish.
- **FR-018**: All traveller-facing text must be managed through localization resource files and must not be hard-coded into UI components.
- **FR-019**: The traveller must be able to select their preferred language before beginning the guidance journey.
- **FR-020**: The selected language must persist throughout the traveller journey.
- **FR-021**: The application architecture must allow additional languages to be added without modifying the core application logic.
- **FR-022**: The app MUST use clear language and accessible interaction patterns that support a wide range of international travellers.
- **FR-023**: The app MUST collect only the minimum amount of data needed to provide the guidance outcome.
- **FR-024**: The app MUST NOT request personal data unless that data directly enables a traveller-facing benefit.
- **FR-025**: The app MUST record journey analytics sufficient to measure whether the experience reduces unnecessary paper form returns.
- **FR-026**: The app MUST preserve the Figma reference design as the UX baseline for flows and screen direction while still honoring the product principles in this specification.

### Key Entities *(include if feature involves data)*

- **Traveller Journey**: A single guidance session containing the traveller's answers, the selected outcome, completion timing, and completion state.
- **Rule Set**: The configurable country and validation guidance used to determine which question, if any, comes next and which final instruction applies.
- **Country Validation Rule**: A configurable rule describing whether a country supports digital validation and how it relates to the issuing and departure countries.
- **Journey Outcome**: The final instruction shown to the traveller, limited to either "Keep your form" or "Send your form to Planet".
- **Analytics Record**: A journey-level summary used to understand completion behavior and paper form return impact.

## Assumptions

- The initial release focuses on the primary traveller guidance journey rather than a broader account or profile experience.
- The traveller-facing flow is designed for short, interrupted sessions in mobile contexts first, with desktop treated as a secondary adaptation.
- Business rules and country validation content are maintained in configuration outside the traveller screens.
- Country validation status is managed in configuration rather than in the user interface.
- Native-language content can be introduced through localization without redesigning the primary flow.
- QR code entry opens the traveller journey at the appropriate starting point for the physical material that was scanned.
- The Figma file is the design reference for screen intent and layout direction, but it does not override the product principles listed by the user.
- The app may evolve to support additional languages and richer rule sets later, but the first release should keep the traveller journey simple and focused.
- Analytics are intended to support business measurement and should avoid collecting personal data unless a direct traveller benefit requires it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of traveller journeys are completed in under 30 seconds on a smartphone in usability testing.
- **SC-002**: 100% of completed journeys end with exactly one final instruction and never show both allowed actions together.
- **SC-003**: At least 85% of first-time travellers in testing reach the correct outcome without assistance.
- **SC-004**: In pilot reporting, the business can measure paper form return reduction using analytics from 95% or more of completed journeys.
- **SC-005**: At least 90% of test participants confirm the final instruction is clear and confidence-inspiring.

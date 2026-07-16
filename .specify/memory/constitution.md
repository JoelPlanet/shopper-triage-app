<!--
Sync Impact Report
- Version change: template (unversioned) -> 1.0.0
- Modified principles:
	- PRINCIPLE_1_NAME -> I. Traveller First
	- PRINCIPLE_2_NAME -> II. Simplicity Over Complexity
	- PRINCIPLE_3_NAME -> III. Mobile First
	- PRINCIPLE_4_NAME -> IV. Fast Completion
	- PRINCIPLE_5_NAME -> V. Clear Single Outcome
	- Added: VI. Configuration Over Hard-Coding
	- Added: VII. Language-Independent Business Logic
	- Added: VIII. Localisation First
	- Added: IX. Accessibility
	- Added: X. Data Minimisation
	- Added: XI. Analytics Readiness
	- Added: XII. MVP Discipline
	- Added: XIII. Figma as UX Baseline
	- Added: XIV. Maintainability for Future Enhancements
- Added sections:
	- Product and Technical Constraints
	- Delivery and Architecture Standards
- Removed sections:
	- SECTION_2_NAME placeholder section
	- SECTION_3_NAME placeholder section
- Templates and docs requiring updates:
	- ✅ .specify/templates/plan-template.md (reviewed; constitution-check structure already compatible)
	- ✅ .specify/templates/spec-template.md (reviewed; no constitution-specific mismatch)
	- ✅ .specify/templates/tasks-template.md (reviewed; no constitution-specific mismatch)
	- ✅ .github/agents/speckit.*.agent.md (reviewed; references remain generic and valid)
	- ✅ specs/001-eu-traveller-guidance/plan.md (updated to remove placeholder-constitution assumption)
- Follow-up TODOs:
	- None
-->

# Shopper Triage App Constitution

## Core Principles

### I. Traveller First
The product MUST optimize for traveller clarity, confidence, and task completion over internal
convenience. Product and technical decisions SHOULD be rejected when they increase traveller
ambiguity or friction without measurable traveller benefit. Rationale: the application exists to
guide travellers to the correct departure action.

### II. Simplicity Over Complexity
The journey MUST ask only the minimum questions required to produce an accurate outcome.
Additional questions, screens, logic branches, and features MUST only be added when they
materially improve decision accuracy or traveller understanding. Rationale: unnecessary
complexity reduces completion and trust.

### III. Mobile First
All UX, content hierarchy, and performance decisions MUST be designed for smartphone use in
time-pressured travel contexts. Desktop support SHOULD be implemented as a secondary
responsive adaptation and MUST NOT degrade the mobile flow. Rationale: the dominant usage
environment is mobile in-store, in transit, and at airports.

### IV. Fast Completion
The primary flow MUST be optimized for fast completion and interrupted usage. Interactions
SHOULD minimize reading, navigation, and cognitive load, and MUST avoid non-essential steps.
Rationale: travellers often operate under limited time and attention.

### V. Clear Single Outcome
Every completed journey MUST end with exactly one unambiguous final action. The traveller UI
MUST NOT display competing final actions at the same time. MVP outcome set is fixed to
KEEP_FORM and SEND_FORM, represented to travellers as Keep your form or Send your form to
Planet. Rationale: one clear instruction prevents decision errors.

### VI. Configuration Over Hard-Coding
Country validation rules, digital validation status, and rule-related content MUST live in
configuration, not embedded in traveller-facing components. Rule updates SHOULD be deployable
without redesigning core screens. Rationale: policy changes are frequent and must remain cheap
and safe.

### VII. Language-Independent Business Logic
Rules evaluation MUST return stable internal outcome and reason codes, not translated strings.
Localization layers MUST map those codes to traveller-facing text. Business logic and language
resources MUST remain separate. Rationale: deterministic logic and translation quality require
strict separation of concerns.

### VIII. Localisation First
All traveller-facing content MUST be sourced from localization resources. Launch languages MUST
match the active specification, and new languages SHOULD be addable without changing core
business logic or journey architecture. If RTL languages are supported, the UI MUST provide
appropriate RTL rendering. Rationale: multilingual support is a first-order product need.

### IX. Accessibility
The experience MUST be usable by a broad range of travellers and SHOULD follow accessibility
best practices for structure, contrast, navigation, and interaction feedback. Content MUST use
plain language and avoid unnecessary jargon. Rationale: accessibility is required for inclusive,
reliable guidance.

### X. Data Minimisation
The app MUST collect only the minimum data required to determine guidance outcomes and measure
business success. Personal data MUST NOT be requested unless it directly enables a clear
traveller-facing benefit. Rationale: lower data collection reduces risk and implementation cost.

### XI. Analytics Readiness
The app MUST support lightweight analytics for journey completion status, completion time,
selected language, issuing country, departure country, outcome shown, and outcome reason.
Analytics MUST support measurement of paper form return reduction without collecting unnecessary
personal data. Rationale: business impact must be measurable from MVP.

### XII. MVP Discipline
The MVP MUST stay focused on traveller guidance and MUST exclude user accounts,
authentication, admin portals, Shopper Portal integration, image/document upload, backend APIs,
and databases unless explicitly justified through a later amendment. Rationale: scope control is
required for fast delivery and lower operational complexity.

### XIII. Figma as UX Baseline
Approved Figma designs MUST be treated as the baseline for flow, layout direction, hierarchy,
and interaction behavior. Implementations SHOULD only diverge with explicit product and design
approval, and MUST still satisfy this Constitution. Rationale: shared UX source-of-truth reduces
rework and interpretation drift.

### XIV. Maintainability for Future Enhancements
Architecture MUST preserve clean extension paths for adding countries, changing validation
rules, adding languages, expanding analytics, supporting QR-driven variants, and introducing
future upload or portal capabilities. Enhancements SHOULD be possible without rewriting the
primary journey architecture. Rationale: MVP speed must not create avoidable rewrite costs.

## Product and Technical Constraints

- All specifications, plans, and tasks MUST include an explicit Constitution Check before
	implementation begins.
- Rule and locale configuration changes MUST be schema-validated and fail safe.
- Traveller-facing text MUST NOT be hard-coded in components or rules modules.
- Primary journey design SHOULD target completion in under 30 seconds on representative mobile
	devices and network conditions.
- Any proposed scope outside MVP Discipline MUST include written product/business justification,
	risk impact, and migration path.

## Delivery and Architecture Standards

- Teams MUST maintain separation of concerns across presentation, rules, configuration,
	localization, and analytics modules.
- Contracts for outcome codes, reason codes, configuration shape, and analytics events MUST be
	versioned and testable.
- Feature work SHOULD prefer additive, configuration-driven change over structural rewrites.
- Every release candidate MUST validate mobile usability, localization integrity,
	accessibility baseline, and single-outcome behavior.
- Future-phase capabilities MAY be scaffolded only when they do not increase MVP complexity or
	violate MVP Discipline.

## Governance

This Constitution is the highest-priority governance artifact for this project. In case of
conflict, this document overrides specifications, plans, and task lists.

Amendment procedure:
1. Propose changes with rationale, impact assessment, and affected artifacts.
2. Obtain explicit approval from designated product and engineering owners.
3. Update dependent templates and active feature documents in the same change set.
4. Record a Sync Impact Report at the top of this file.

Versioning policy:
- MAJOR: Backward-incompatible governance change, principle removal, or principle redefinition.
- MINOR: New principle/section or materially expanded mandatory guidance.
- PATCH: Clarification, wording refinement, or non-semantic editorial improvement.

Compliance review expectations:
- Every speckit.specify, speckit.plan, speckit.tasks, and speckit.implement flow MUST check
	compliance with all MUST statements.
- Non-compliant work MUST be blocked unless a time-boxed waiver is documented with owner,
	rationale, and expiry date.
- PR reviews SHOULD explicitly cite affected principle IDs when approving or requesting changes.

**Version**: 1.0.0 | **Ratified**: 2026-07-16 | **Last Amended**: 2026-07-16

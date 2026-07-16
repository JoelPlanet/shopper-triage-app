# Research: EU Traveller Guidance

## Decision 1: Technology Stack

- Decision: Use a static SPA stack with TypeScript, React, and Vite.
- Rationale: This provides a lightweight deployment model, fast mobile performance, and enough UI composability to match Figma flows while avoiding backend complexity in MVP.
- Alternatives considered:
  - Plain HTML/JS: simpler runtime but lower maintainability for multi-screen localized flows.
  - Next.js SSR: unnecessary infrastructure and runtime complexity for MVP.

## Decision 2: Hosting Approach

- Decision: Deploy static assets to CDN-backed static hosting (for example Azure Static Web Apps, Netlify, Vercel static export, or Cloudflare Pages).
- Rationale: Static hosting minimizes operational burden, supports global travellers with low latency, and aligns with no-backend MVP scope.
- Alternatives considered:
  - Containerized app hosting: over-complex for static content and no server logic.
  - Custom VM hosting: unnecessary operational overhead.

## Decision 3: Localization Approach

- Decision: Store all traveller-facing strings in locale JSON resources and load via i18next.
- Rationale: Guarantees no hard-coded UI strings, supports launch languages, and enables additional languages without changing business logic.
- Alternatives considered:
  - Inline constant maps in components: violates requirement against hard-coded traveller-facing text.
  - CMS-based translation platform for MVP: adds integration complexity and dependency risk.

## Decision 4: Rules Engine Design

- Decision: Implement a pure rules engine module that receives issuing country, departure country, and country configuration, then returns outcome codes only: KEEP_FORM or SEND_FORM.
- Rationale: Keeps logic testable, deterministic, language-independent, and separated from presentation and translations.
- Alternatives considered:
  - Rules embedded in UI component handlers: hard to test and violates separation of concerns.
  - Server-side rule evaluation API: unnecessary backend for MVP.

## Decision 5: Country Configuration Strategy

- Decision: Maintain digital validation status and country rule data in versioned JSON config files under public/config, validated at runtime against a schema.
- Rationale: Business users can update config content in deployment workflows without modifying UI source code. Schema validation prevents malformed rule sets.
- Alternatives considered:
  - Hard-coded TypeScript rule objects: fails maintainability and update requirements.
  - Database-backed config service: too complex for MVP.

## Decision 6: Analytics Implementation

- Decision: Add a lightweight analytics adapter with explicit domain events and pluggable provider integration, defaulting to no-op when provider keys are absent.
- Rationale: Captures required reporting fields without coupling business logic to vendor SDK details and avoids blocking user flow if analytics fails.
- Alternatives considered:
  - Direct provider calls in UI screens: mixes concerns and complicates tests.
  - Full product analytics platform integration at MVP start: increased complexity and setup overhead.

## Decision 7: Mobile-First and Figma Alignment

- Decision: Implement screens and navigation directly from Figma flow order, with mobile breakpoints as baseline and desktop as secondary responsive adaptation.
- Rationale: Users are primarily on smartphones while travelling; Figma is the UX source of truth and should govern structure and hierarchy.
- Alternatives considered:
  - Desktop-first with responsive shrink: higher mobile usability risk.
  - Diverging from Figma for speed: increases design drift and review churn.

## Decision 8: QR Entry Handling

- Decision: Support QR-based deep links using URL query parameters and route mapping in the SPA.
- Rationale: Enables physical-material entry without backend APIs and keeps handoff simple.
- Alternatives considered:
  - Backend redirect service: adds non-MVP infrastructure.
  - Ignoring QR parameters and always starting home: fails entry requirement.

## Decision 9: Scope Discipline

- Decision: Exclude accounts, auth, admin tooling, Shopper Portal integration, image upload/download, and document management from MVP implementation artifacts.
- Rationale: Preserves delivery speed and keeps the architecture intentionally simple while meeting core traveller outcome needs.
- Alternatives considered:
  - Building placeholders for all future capabilities now: unnecessary complexity and maintenance burden.

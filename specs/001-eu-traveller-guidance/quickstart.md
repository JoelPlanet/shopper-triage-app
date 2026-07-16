# Quickstart: EU Traveller Guidance Validation

## Purpose

Validate the MVP end-to-end against core traveller scenarios, configuration-driven rules, localization requirements, and analytics capture.

## Prerequisites

- Node.js 20+
- npm 10+
- Local repository checkout

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start local development server:

```bash
npm run dev
```

3. Open the local URL on a mobile viewport (browser responsive mode or physical device).

## Validation Scenarios

### Scenario 1: Same Country + Digital Validation -> KEEP_FORM

1. Select language: English.
2. Set issuing country to one with supportsDigitalValidation = true.
3. Set departure country to the same country.
4. Submit flow.

Expected:

- Outcome shown is KEEP_FORM message in selected language.
- Only one final action appears.
- Analytics event includes issuing/departure country and outcomeCode = KEEP_FORM.

### Scenario 2: Different Countries -> SEND_FORM

1. Select language: Portuguese.
2. Set issuing country with supportsDigitalValidation = true.
3. Set departure country to a different EU country.
4. Submit flow.

Expected:

- Outcome shown is SEND_FORM message in Portuguese.
- Analytics includes outcomeCode = SEND_FORM.

### Scenario 3: Issuing Country Without Digital Validation -> SEND_FORM

1. Select language: Spanish.
2. Set issuing country where supportsDigitalValidation = false.
3. Set departure country to same or different country.
4. Submit flow.

Expected:

- Outcome is SEND_FORM in all cases.
- Rule precedence follows NO_DIGITAL_VALIDATION first.

### Scenario 4: Localization Coverage

1. Repeat baseline flow for each launch locale: en, es, pt, zh, ar, tr.
2. Observe all prompts and outcome messages.

Expected:

- No untranslated fallback keys are displayed.
- No traveller-facing UI text is hard-coded outside locale resources.
- RTL language rendering (Arabic) remains usable and visually aligned with design intent.

### Scenario 5: Configuration Update Without UI Code Change

1. Edit public/config/country-rules.v1.json to toggle a country's supportsDigitalValidation value.
2. Restart app if required by tooling.
3. Run scenario for that country pair again.

Expected:

- Outcome changes according to updated config.
- No UI source file changes are required.

### Scenario 6: QR Entry

1. Open app with /?entry=qr.
2. Complete journey.

Expected:

- Flow starts successfully and remains mobile-first.
- Analytics sourceType is QR.
- Core rule evaluation remains unchanged.

## Non-Functional Validation

- Mobile-first usability: Primary controls reachable with thumb interaction on common smartphone widths.
- Journey speed: Representative users complete primary flow under 30 seconds.
- Accessibility: Text contrast, focus states, semantic structure, and clear action language verified.

## References

- Rules/config contract: contracts/rules-and-config-contract.md
- Data model: data-model.md
- Spec: spec.md

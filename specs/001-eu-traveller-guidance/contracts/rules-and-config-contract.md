# Contract: Rules Engine and Configuration

## 1. Rules Engine Interface Contract

### Function Signature

- evaluateOutcome(input: RuleInput, config: RulesConfig): RuleResult

### RuleInput

```json
{
  "issuingCountryCode": "PT",
  "departureCountryCode": "PT"
}
```

### RulesConfig (shape)

```json
{
  "version": "1.0.0",
  "defaultOutcomeCode": "SEND_FORM",
  "precedence": [
    "NO_DIGITAL_VALIDATION",
    "SAME_COUNTRY_WITH_DIGITAL",
    "DIFFERENT_COUNTRY"
  ],
  "countries": [
    {
      "countryCode": "PT",
      "supportsDigitalValidation": true,
      "isActive": true,
      "updatedAt": "2026-07-16T00:00:00Z"
    }
  ]
}
```

### RuleResult

```json
{
  "outcomeCode": "KEEP_FORM",
  "ruleApplied": "SAME_COUNTRY_WITH_DIGITAL"
}
```

### Required Rules

- Rule A: If issuing country does not support digital validation, outcomeCode MUST be SEND_FORM.
- Rule B: Else if issuing country equals departure country, outcomeCode MUST be KEEP_FORM.
- Rule C: Else outcomeCode MUST be SEND_FORM.

### Language Independence Rule

- Rule engine output MUST only return outcome codes and rule identifiers.
- Human-readable traveller messaging MUST be resolved in localization resources.

## 2. Country Configuration Contract

### File Location

- public/config/country-rules.v1.json

### Validation Requirements

- Every country entry MUST provide countryCode and supportsDigitalValidation.
- countryCode values MUST be unique and ISO 3166-1 alpha-2.
- Invalid or missing config MUST fail safe to SEND_FORM and log a non-blocking diagnostic event.

## 3. Localization Contract

### File Location

- public/locales/{locale}.json

### Required Launch Locales

- en, es, pt, zh, ar, tr

### Required Keys

- labels.issuingCountryPrompt
- labels.departureCountryPrompt
- labels.nextAction
- outcomes.KEEP_FORM
- outcomes.SEND_FORM
- errors.configurationUnavailable

### Hard-Coding Constraint

- Traveller-facing text MUST NOT be hard-coded in UI components.

## 4. Analytics Event Contract

### Event: JOURNEY_COMPLETED

```json
{
  "eventName": "JOURNEY_COMPLETED",
  "journeyId": "9e6a67fd-7df0-4f8f-8b8b-53ed7d5f1f58",
  "timestamp": "2026-07-16T10:30:00Z",
  "completionDurationMs": 18000,
  "issuingCountryCode": "PT",
  "departureCountryCode": "ES",
  "outcomeCode": "SEND_FORM",
  "selectedLanguage": "pt",
  "sourceType": "QR"
}
```

### Required Reporting Fields

- completion status and timing
- issuing country
- departure country
- outcome code

## 5. QR Entry Contract

### Deep Link Pattern

- /?entry=qr
- Optional metadata params can be included (for example source campaign), but they MUST NOT alter core rule logic.

### Expected Behavior

- entry=qr sets sourceType = QR for analytics.
- Flow still requires language selection and required country questions unless explicitly prefilled by validated params.

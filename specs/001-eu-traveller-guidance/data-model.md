# Data Model: EU Traveller Guidance

## Entity: TravellerJourney

- Purpose: Represents one guidance session from entry to final instruction.
- Fields:
  - journeyId: string (UUID generated client-side)
  - startedAt: string (ISO timestamp)
  - completedAt: string | null
  - sourceType: enum (DIRECT, QR)
  - selectedLanguage: string (locale code)
  - issuingCountryCode: string | null (ISO 3166-1 alpha-2)
  - departureCountryCode: string | null (ISO 3166-1 alpha-2)
  - outcomeCode: enum | null (KEEP_FORM, SEND_FORM)
  - completionDurationMs: number | null
  - completionStatus: enum (IN_PROGRESS, COMPLETED, ABANDONED)
- Validation rules:
  - selectedLanguage is required before the first traveller-facing question.
  - issuingCountryCode and departureCountryCode are required before rule evaluation.
  - outcomeCode is required when completionStatus = COMPLETED.
- State transitions:
  - IN_PROGRESS -> COMPLETED when outcome is displayed.
  - IN_PROGRESS -> ABANDONED when user exits before outcome.

## Entity: CountryValidationRule

- Purpose: Encodes country-level digital validation status used by rules engine.
- Fields:
  - countryCode: string (ISO 3166-1 alpha-2)
  - supportsDigitalValidation: boolean
  - isActive: boolean
  - updatedAt: string (ISO timestamp)
  - updatedBy: string (optional metadata, non-traveller-facing)
- Validation rules:
  - countryCode must be unique.
  - supportsDigitalValidation must be explicitly true/false.
  - inactive entries are ignored by evaluation.

## Entity: RulesConfig

- Purpose: Holds rule metadata and precedence configuration for deterministic outcomes.
- Fields:
  - version: string
  - defaultOutcomeCode: enum (SEND_FORM)
  - precedence: array of enum identifiers
  - countries: CountryValidationRule[]
- Validation rules:
  - precedence must include NO_DIGITAL_VALIDATION before SAME_COUNTRY_WITH_DIGITAL.
  - countries list must contain every supported issuing/departure country used in UI options.

## Entity: LocaleResource

- Purpose: Stores all traveller-facing text for one language.
- Fields:
  - localeCode: string (en, es, pt, zh, ar, tr)
  - labels: map<string, string>
  - outcomeMessages: map<OutcomeCode, string>
  - metadata: object (direction, fallback locale)
- Validation rules:
  - No empty values for required traveller-facing keys.
  - outcomeMessages must define KEEP_FORM and SEND_FORM.

## Entity: AnalyticsEvent

- Purpose: Captures lightweight event payloads for reporting.
- Fields:
  - eventName: enum (JOURNEY_STARTED, JOURNEY_COMPLETED, JOURNEY_ABANDONED, OUTCOME_SHOWN)
  - timestamp: string (ISO timestamp)
  - journeyId: string
  - issuingCountryCode: string | null
  - departureCountryCode: string | null
  - outcomeCode: enum | null
  - completionDurationMs: number | null
  - selectedLanguage: string
  - sourceType: enum (DIRECT, QR)
- Validation rules:
  - JOURNEY_COMPLETED and OUTCOME_SHOWN require outcomeCode.
  - completionDurationMs must be >= 0 when present.

## Business Rule Evaluation Model

- Inputs:
  - issuingCountryCode
  - departureCountryCode
  - supportsDigitalValidation for issuingCountryCode
- Derived flags:
  - sameCountry = issuingCountryCode == departureCountryCode
  - issuingSupportsDigital = supportsDigitalValidation
- Decision table:
  - If issuingSupportsDigital = false -> SEND_FORM
  - Else if sameCountry = true -> KEEP_FORM
  - Else -> SEND_FORM
- Output:
  - outcomeCode only (KEEP_FORM or SEND_FORM)

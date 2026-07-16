import { OUTCOME_CODES, type OutcomeCode } from "./outcome-codes";
import { REASON_CODES, type ReasonCode } from "./reason-codes";

export interface RuleInput {
  issuingCountryCode: string;
  departureCountryCode: string;
}

export interface CountryValidationRule {
  countryCode: string;
  supportsDigitalValidation: boolean;
  isActive: boolean;
  updatedAt?: string;
}

export interface RulesConfig {
  version: string;
  defaultOutcomeCode: OutcomeCode;
  precedence: readonly string[];
  countries: CountryValidationRule[];
}

export interface RuleResult {
  outcomeCode: OutcomeCode;
  reasonCode: ReasonCode;
  ruleApplied:
    | "NO_DIGITAL_VALIDATION"
    | "DIFFERENT_COUNTRY"
    | "SAME_COUNTRY_WITH_DIGITAL"
    | "UNSUPPORTED_ROUTE";
}

function normalizeCountryCode(code: string): string {
  return code.trim().toUpperCase();
}

function findIssuingCountry(
  issuingCountryCode: string,
  countries: CountryValidationRule[],
): CountryValidationRule | undefined {
  return countries.find((country) => country.countryCode === issuingCountryCode);
}

function toResult(
  outcomeCode: OutcomeCode,
  reasonCode: ReasonCode,
  ruleApplied: RuleResult["ruleApplied"],
): RuleResult {
  return {
    outcomeCode,
    reasonCode,
    ruleApplied,
  };
}

function failSafeResult(): RuleResult {
  return toResult(
    OUTCOME_CODES.SEND_FORM,
    REASON_CODES.SEND_FORM_UNSUPPORTED_ROUTE,
    "UNSUPPORTED_ROUTE",
  );
}

export function evaluateOutcome(input: RuleInput, config: RulesConfig): RuleResult {
  const issuingCountryCode = normalizeCountryCode(input.issuingCountryCode);
  const departureCountryCode = normalizeCountryCode(input.departureCountryCode);

  if (!issuingCountryCode || !departureCountryCode) {
    return failSafeResult();
  }

  const issuingCountry = findIssuingCountry(issuingCountryCode, config.countries);

  if (!issuingCountry || !issuingCountry.isActive) {
    return failSafeResult();
  }

  // Rule 1: Non-digital issuing country.
  if (!issuingCountry.supportsDigitalValidation) {
    return toResult(
      OUTCOME_CODES.SEND_FORM,
      REASON_CODES.SEND_FORM_NON_DIGITAL_ISSUING_COUNTRY,
      "NO_DIGITAL_VALIDATION",
    );
  }

  // Rule 2: Cross-border departure.
  if (issuingCountryCode !== departureCountryCode) {
    return toResult(
      OUTCOME_CODES.SEND_FORM,
      REASON_CODES.SEND_FORM_CROSS_BORDER_DEPARTURE,
      "DIFFERENT_COUNTRY",
    );
  }

  // Rule 3: Same-country departure with digital validation.
  if (issuingCountryCode === departureCountryCode && issuingCountry.supportsDigitalValidation) {
    return toResult(
      OUTCOME_CODES.KEEP_FORM,
      REASON_CODES.KEEP_FORM_DIGITAL_SAME_COUNTRY,
      "SAME_COUNTRY_WITH_DIGITAL",
    );
  }

  // Rule 4: Fallback for unsupported routes.
  return failSafeResult();
}

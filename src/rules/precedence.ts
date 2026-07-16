export const RULE_PRECEDENCE = [
  // Rule 1: Non-digital issuing country always requires SEND_FORM.
  "NO_DIGITAL_VALIDATION",
  // Rule 2: Cross-border departures require SEND_FORM.
  "DIFFERENT_COUNTRY",
  // Rule 3: Same-country with digital validation allows KEEP_FORM.
  "SAME_COUNTRY_WITH_DIGITAL",
] as const;

export type RulePrecedence = (typeof RULE_PRECEDENCE)[number];

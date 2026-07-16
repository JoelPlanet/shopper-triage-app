export const OUTCOME_CODES = {
  KEEP_FORM: "KEEP_FORM",
  SEND_FORM: "SEND_FORM",
} as const;

export type OutcomeCode = (typeof OUTCOME_CODES)[keyof typeof OUTCOME_CODES];

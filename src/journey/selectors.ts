import type { TravellerJourney } from "./state";

export function isReadyForRuleEvaluation(state: TravellerJourney): boolean {
  return Boolean(state.issuingCountryCode && state.departureCountryCode);
}

export function isCompleted(state: TravellerJourney): boolean {
  return state.completionStatus === "COMPLETED";
}

export function getOutcome(state: TravellerJourney): string | null {
  return state.outcomeCode;
}

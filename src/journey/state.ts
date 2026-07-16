import type { OutcomeCode } from "../rules/outcome-codes";
import type { ReasonCode } from "../rules/reason-codes";

export type JourneySourceType = "DIRECT" | "QR";
export type JourneyCompletionStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export interface TravellerJourney {
  journeyId: string;
  startedAt: string;
  completedAt: string | null;
  sourceType: JourneySourceType;
  selectedLanguage: string | null;
  issuingCountryCode: string | null;
  departureCountryCode: string | null;
  outcomeCode: OutcomeCode | null;
  reasonCode: ReasonCode | null;
  completionDurationMs: number | null;
  completionStatus: JourneyCompletionStatus;
}

export type JourneyAction =
  | { type: "START_JOURNEY"; sourceType?: JourneySourceType }
  | { type: "SELECT_LANGUAGE"; locale: string }
  | { type: "SET_ISSUING_COUNTRY"; countryCode: string }
  | { type: "SET_DEPARTURE_COUNTRY"; countryCode: string }
  | {
      type: "COMPLETE_JOURNEY";
      outcomeCode: OutcomeCode;
      reasonCode: ReasonCode;
      completedAt?: string;
    }
  | { type: "ABANDON_JOURNEY"; abandonedAt?: string };

function createJourneyId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `journey-${Date.now()}`;
}

export function createInitialJourneyState(sourceType: JourneySourceType = "DIRECT"): TravellerJourney {
  return {
    journeyId: createJourneyId(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    sourceType,
    selectedLanguage: null,
    issuingCountryCode: null,
    departureCountryCode: null,
    outcomeCode: null,
    reasonCode: null,
    completionDurationMs: null,
    completionStatus: "IN_PROGRESS",
  };
}

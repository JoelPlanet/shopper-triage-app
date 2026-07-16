import type { TravellerJourney, JourneyAction } from "./state";

function normalizeCountryCode(countryCode: string): string {
  return countryCode.trim().toUpperCase();
}

function calculateCompletionDurationMs(startedAt: string, completedAt: string): number {
  const started = Date.parse(startedAt);
  const completed = Date.parse(completedAt);

  if (Number.isNaN(started) || Number.isNaN(completed)) {
    return 0;
  }

  return Math.max(0, completed - started);
}

export function journeyReducer(state: TravellerJourney, action: JourneyAction): TravellerJourney {
  switch (action.type) {
    case "START_JOURNEY": {
      return {
        ...state,
        sourceType: action.sourceType ?? state.sourceType,
        startedAt: new Date().toISOString(),
        completedAt: null,
        outcomeCode: null,
        reasonCode: null,
        completionDurationMs: null,
        completionStatus: "IN_PROGRESS",
      };
    }
    case "SELECT_LANGUAGE": {
      return {
        ...state,
        selectedLanguage: action.locale,
      };
    }
    case "SET_ISSUING_COUNTRY": {
      return {
        ...state,
        issuingCountryCode: normalizeCountryCode(action.countryCode),
      };
    }
    case "SET_DEPARTURE_COUNTRY": {
      return {
        ...state,
        departureCountryCode: normalizeCountryCode(action.countryCode),
      };
    }
    case "COMPLETE_JOURNEY": {
      const completedAt = action.completedAt ?? new Date().toISOString();

      return {
        ...state,
        completedAt,
        outcomeCode: action.outcomeCode,
        reasonCode: action.reasonCode,
        completionDurationMs: calculateCompletionDurationMs(state.startedAt, completedAt),
        completionStatus: "COMPLETED",
      };
    }
    case "ABANDON_JOURNEY": {
      return {
        ...state,
        completedAt: action.abandonedAt ?? new Date().toISOString(),
        completionStatus: "ABANDONED",
      };
    }
    default: {
      return state;
    }
  }
}

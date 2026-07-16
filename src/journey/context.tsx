import { createContext, useContext } from "react";
import type { Dispatch } from "react";
import type { TravellerJourney, JourneyAction } from "./state";

export interface JourneyContextValue {
  state: TravellerJourney;
  dispatch: Dispatch<JourneyAction>;
}

export const JourneyContext = createContext<JourneyContextValue | null>(null);

export function useJourney(): JourneyContextValue {
  const context = useContext(JourneyContext);

  if (!context) {
    throw new Error("useJourney must be used within a JourneyContext provider");
  }

  return context;
}

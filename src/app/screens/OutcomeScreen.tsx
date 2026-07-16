import { useEffect, useMemo } from "react";
import { evaluateOutcome, type RulesConfig } from "../../rules/engine";
import { OUTCOME_CODES } from "../../rules/outcome-codes";
import { getLocalizedContent } from "../../i18n";
import { MobileFrame } from "../components/MobileFrame";
import { useJourney } from "../../journey/context";
import { isReadyForRuleEvaluation } from "../../journey/selectors";
import type { DynamicInstructionEntry } from "../data/dynamicInstructions";
import { KeepFormInstructionsScreen } from "./KeepFormInstructionsScreen";
import { SendFormInstructionsScreen } from "./SendFormInstructionsScreen";

interface OutcomeScreenProps {
  config: RulesConfig;
  selectedDepartureAirport: string;
  selectedIssuingCountryCode: string | null;
  selectedDepartureCountryCode: string | null;
  selectedDepartureInstruction: DynamicInstructionEntry | null;
}

export function OutcomeScreen({
  config,
  selectedDepartureAirport,
  selectedIssuingCountryCode,
  selectedDepartureCountryCode,
  selectedDepartureInstruction,
}: OutcomeScreenProps) {
  const { state, dispatch } = useJourney();
  const localized = getLocalizedContent(state.selectedLanguage);

  const ruleResult = useMemo(() => {
    if (!isReadyForRuleEvaluation(state)) {
      return null;
    }

    return evaluateOutcome(
      {
        issuingCountryCode: state.issuingCountryCode ?? "",
        departureCountryCode: state.departureCountryCode ?? "",
      },
      config,
    );
  }, [config, state]);

  useEffect(() => {
    if (!ruleResult || state.completionStatus === "COMPLETED") {
      return;
    }

    dispatch({
      type: "COMPLETE_JOURNEY",
      outcomeCode: ruleResult.outcomeCode,
      reasonCode: ruleResult.reasonCode,
    });
  }, [dispatch, ruleResult, state.completionStatus]);

  if (!ruleResult) {
    return (
      <MobileFrame title={localized.app.title} subtitle={localized.app.subtitle} progress={100}>
        <h2 style={{ marginTop: 0, fontSize: 34 }}>{localized.labels.nextAction}</h2>
      </MobileFrame>
    );
  }

  const isKeepForm = ruleResult.outcomeCode === OUTCOME_CODES.KEEP_FORM;

  return isKeepForm ? (
    <KeepFormInstructionsScreen
      locale={state.selectedLanguage}
      selectedDepartureAirport={selectedDepartureAirport}
      selectedIssuingCountryCode={selectedIssuingCountryCode}
      selectedDepartureCountryCode={selectedDepartureCountryCode}
      selectedDepartureInstruction={selectedDepartureInstruction}
    />
  ) : (
    <SendFormInstructionsScreen
      locale={state.selectedLanguage}
      selectedDepartureAirport={selectedDepartureAirport}
      selectedIssuingCountryCode={selectedIssuingCountryCode}
      selectedDepartureCountryCode={selectedDepartureCountryCode}
      selectedDepartureInstruction={selectedDepartureInstruction}
    />
  );
}

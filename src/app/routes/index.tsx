import { useEffect, useMemo, useReducer, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { appConfigSchema, type AppConfigFile } from "../../config/app-config.schema";
import { loadRulesConfig } from "../../config/loader";
import { applyDocumentDirection } from "../../i18n/direction";
import { getLocalizedContent } from "../../i18n";
import { resolveLocale, type LocaleCode } from "../../i18n/resources";
import { getDynamicInstruction } from "../data/dynamicInstructions";
import { JourneyContext } from "../../journey/context";
import { journeyReducer } from "../../journey/reducer";
import { createInitialJourneyState } from "../../journey/state";
import type { RulesConfig } from "../../rules/engine";
import { DepartureCountryScreen } from "../screens/DepartureCountryScreen";
import { IssuingCountryScreen } from "../screens/IssuingCountryScreen";
import { LanguageSelectionScreen } from "../screens/LanguageSelectionScreen";
import { OutcomeScreen } from "../screens/OutcomeScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";

const APP_CONFIG_PATH = "/config/app-config.v1.json";

const FALLBACK_APP_CONFIG: AppConfigFile = {
  version: "1.0.0",
  defaultLocale: "en",
  supportedLocales: ["en", "es", "pt", "zh", "ar", "tr"],
};

async function loadAppConfig(path: string = APP_CONFIG_PATH): Promise<AppConfigFile> {
  try {
    const response = await fetch(path, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return FALLBACK_APP_CONFIG;
    }

    const raw = (await response.json()) as unknown;
    const parsed = appConfigSchema.safeParse(raw);

    if (!parsed.success) {
      return FALLBACK_APP_CONFIG;
    }

    return parsed.data;
  } catch {
    return FALLBACK_APP_CONFIG;
  }
}

function JourneyFlow({
  appConfig,
  rulesConfig,
}: {
  appConfig: AppConfigFile;
  rulesConfig: RulesConfig;
}) {
  const [state, dispatch] = useReducer(journeyReducer, createInitialJourneyState());
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(true);
  const [departureAirport, setDepartureAirport] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const activeCountries = useMemo(
    () => rulesConfig.countries.filter((country) => country.isActive).map((country) => ({ code: country.countryCode })),
    [rulesConfig.countries],
  );

  useEffect(() => {
    const persistedLocale = localStorage.getItem("journey.selectedLanguage");

    if (persistedLocale && !state.selectedLanguage) {
      const locale = resolveLocale(persistedLocale);
      dispatch({ type: "SELECT_LANGUAGE", locale });
    }
  }, [state.selectedLanguage]);

  useEffect(() => {
    const locale = state.selectedLanguage ?? appConfig.defaultLocale;
    applyDocumentDirection(locale);
  }, [appConfig.defaultLocale, state.selectedLanguage]);

  useEffect(() => {
    if (location.pathname === "/outcome") {
      return;
    }

    const readyForOutcome = Boolean(state.issuingCountryCode && state.departureCountryCode);

    if (!readyForOutcome && location.pathname === "/departure-country") {
      return;
    }
  }, [location.pathname, state.departureCountryCode, state.issuingCountryCode]);

  const selectedLocale = state.selectedLanguage ?? appConfig.defaultLocale;
  const localizedContent = getLocalizedContent(selectedLocale);
  const selectedDepartureInstruction = useMemo(
    () => getDynamicInstruction(state.departureCountryCode, departureAirport),
    [departureAirport, state.departureCountryCode],
  );

  return (
    <JourneyContext.Provider value={{ state, dispatch }}>
      <LanguageSelectionScreen
        currentLocale={state.selectedLanguage}
        supportedLocales={appConfig.supportedLocales as LocaleCode[]}
        isOpen={isLanguageModalOpen}
        onSelectLocale={(locale) => {
          dispatch({ type: "SELECT_LANGUAGE", locale });
          localStorage.setItem("journey.selectedLanguage", locale);
          setIsLanguageModalOpen(false);
        }}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <WelcomeScreen
              locale={selectedLocale}
              onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
              onGetStarted={() => navigate("/issuing-country")}
            />
          }
        />

        <Route
          path="/issuing-country"
          element={
            <IssuingCountryScreen
              locale={selectedLocale}
              selectedCountryCode={state.issuingCountryCode}
              countries={activeCountries}
              onSelectCountry={(countryCode) => {
                dispatch({ type: "SET_ISSUING_COUNTRY", countryCode });
              }}
              onCancel={() => {
                navigate("/");
              }}
              onContinue={() => {
                if (!state.issuingCountryCode) {
                  return;
                }

                navigate("/departure-country");
              }}
            />
          }
        />

        <Route
          path="/departure-country"
          element={
            state.issuingCountryCode ? (
              <DepartureCountryScreen
                locale={selectedLocale}
                selectedCountryCode={state.departureCountryCode}
                selectedAirport={departureAirport}
                departureDate={departureDate}
                countries={localizedContent.departureDetails.countryCodes.map((countryCode) => ({ code: countryCode }))}
                onSelectCountry={(countryCode) => {
                  dispatch({ type: "SET_DEPARTURE_COUNTRY", countryCode });
                  setDepartureAirport("");
                }}
                onSelectAirport={(airport) => {
                  setDepartureAirport(airport);
                }}
                onSelectDepartureDate={(date) => {
                  setDepartureDate(date);
                }}
                onCancel={() => {
                  navigate("/");
                }}
                onContinue={() => {
                  if (!state.departureCountryCode || !departureAirport || !departureDate) {
                    return;
                  }

                  navigate("/outcome");
                }}
              />
            ) : (
              <Navigate to="/issuing-country" replace />
            )
          }
        />

        <Route
          path="/outcome"
          element={
            state.issuingCountryCode && state.departureCountryCode ? (
              <OutcomeScreen
                config={rulesConfig}
                selectedDepartureAirport={departureAirport}
                selectedDepartureInstruction={selectedDepartureInstruction}
                selectedIssuingCountryCode={state.issuingCountryCode}
                selectedDepartureCountryCode={state.departureCountryCode}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </JourneyContext.Provider>
  );
}

export function AppRoutes() {
  const [appConfig, setAppConfig] = useState<AppConfigFile | null>(null);
  const [rulesConfig, setRulesConfig] = useState<RulesConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfigs() {
      const [resolvedAppConfig, resolvedRulesConfig] = await Promise.all([
        loadAppConfig(),
        loadRulesConfig(),
      ]);

      if (!isMounted) {
        return;
      }

      setAppConfig(resolvedAppConfig);
      setRulesConfig(resolvedRulesConfig.config);
    }

    void loadConfigs();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!appConfig || !rulesConfig) {
    return null;
  }

  return (
    <BrowserRouter>
      <JourneyFlow appConfig={appConfig} rulesConfig={rulesConfig} />
    </BrowserRouter>
  );
}

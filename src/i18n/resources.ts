export type LocaleCode = "en" | "es" | "pt" | "zh" | "ar" | "tr";

interface WelcomeStep {
  icon: string;
  title: string;
  description: string;
}

interface LocaleResource {
  app: {
    title: string;
    subtitle: string;
  };
  labels: {
    selectLanguage: string;
    close: string;
    getStarted: string;
    continue: string;
    cancel: string;
    save: string;
    back: string;
    welcomeHeadline: string;
    welcomeDescription: string;
    issuingCountryPrompt: string;
    tripDetailsHeading: string;
    departureCountryPrompt: string;
    departureLocationPrompt: string;
    departureDatePrompt: string;
    repeatFlowMessage: string;
    nextAction: string;
  };
  outcomes: {
    KEEP_FORM: string;
    SEND_FORM: string;
    keepStepOneTitle: string;
    keepStepOneDescription: string;
    keepStepTwoTitle: string;
    keepStepTwoDescription: string;
    sendStepOneTitle: string;
    sendStepOneDescription: string;
    sendStepTwoTitle: string;
    sendStepTwoDescription: string;
    primaryActionKeep: string;
    secondaryActionKeep: string;
    primaryActionSend: string;
    secondaryActionSend: string;
    footerHintSend: string;
  };
  welcomeSteps: WelcomeStep[];
  countries: Record<string, string>;
  departureDetails: {
    countryCodes: string[];
    locationsByCountry: Record<string, string[]>;
  };
  localeNames: Record<LocaleCode, string>;
}

interface LocaleResourceOverrides {
  app?: Partial<LocaleResource["app"]>;
  labels?: Partial<LocaleResource["labels"]>;
  outcomes?: Partial<LocaleResource["outcomes"]>;
  welcomeSteps?: LocaleResource["welcomeSteps"];
  countries?: LocaleResource["countries"];
  departureDetails?: LocaleResource["departureDetails"];
  localeNames?: Partial<LocaleResource["localeNames"]>;
}

const countryNamesEn: Record<string, string> = {
  AT: "Austria",
  BE: "Belgium",
  CH: "Switzerland",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DE: "Germany",
  DK: "Denmark",
  ES: "Spain",
  FR: "France",
  GR: "Greece",
  FI: "Finland",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LU: "Luxembourg",
  MT: "Malta",
  NL: "Netherlands",
  NO: "Norway",
  PL: "Poland",
  PT: "Portugal",
  SE: "Sweden",
  SK: "Slovakia",
};

const departureDetailsDefault = {
  countryCodes: ["ES", "DE", "IT", "PT", "IE", "FR", "AT", "NL", "CZ", "FI", "GR", "DK"],
  locationsByCountry: {
    ES: [
      "Alicante",
      "Barcelona Terminal 1",
      "Barcelona Terminal 2",
      "Bilbao",
      "Madrid Terminal 1",
      "Madrid Terminal 2",
      "Madrid Terminal 4",
      "Malaga",
      "Palma de Mallorca",
      "Sevilla",
      "Valencia",
      "Other",
    ],
    DE: [
      "Frankfurt Airport Terminal 1",
      "Frankfurt Airport Terminal 2",
      "Berlin Airport Terminal 1",
      "München Airport",
      "Stuttgart Airport",
      "Nürnberg Airport",
      "Düsseldorf Airport",
      "Köln Bonn Airport",
      "Hannover Airport",
    ],
    IT: [
      "Rome Fiumicino Terminal 1",
      "Rome Fiumicino Terminal 3",
      "Rome Ciampino",
      "Milan Malpensa Terminal 1",
      "Milan Malpensa Terminal 2",
      "Venice",
      "Naples",
      "Linate",
      "Bergamo Airport Orio al Serio",
      "Bologna",
      "Florence",
      "Pisa",
      "Catania",
      "Olbia",
      "Palermo",
      "Other",
    ],
    PT: [
      "Lisbon Terminal 1",
      "Lisbon Terminal 2",
      "Porto",
      "Faro",
      "Madeira",
      "Lisbon cruise port Santa Apollonia",
      "Lisbon cruise port - Jardim do Tabaco Quay",
      "Other",
    ],
    IE: [
      "Dublin Airport Terminal 1",
      "Dublin Airport Terminal 2",
      "Shannon Airport",
      "Kerry Airport",
      "Cork Airport",
      "Ireland West (Knock) Airport",
      "Departure by ship",
    ],
    FR: [
      "Paris-Charles de Gaulle Terminal 1",
      "Paris-Charles de Gaulle Terminal 2B",
      "Paris-Charles de Gaulle Terminal 2C",
      "Paris-Charles de Gaulle Terminal 2D",
      "Paris-Charles de Gaulle Terminal 2E",
      "Paris-Charles de Gaulle Terminal 2F",
      "Paris-Charles de Gaulle Terminal 3",
      "Paris-Orly Terminal 1-2",
      "Paris-Orly Terminal 3",
      "Paris-Orly Terminal 4",
      "Paris-Beauvais",
      "Lyon-Saint-Exupéry Terminal 1",
      "Lyon-Saint-Exupéry Terminal 2",
      "Basel-Mulhouse-Freiburg",
      "Biarritz Airport",
      "Marseille Provence",
      "Nice Côte d'Azur Terminal 1",
      "Nice Côte d'Azur Terminal 2",
      "Bordeaux Hall A",
      "Bordeaux Hall B",
      "Toulouse",
      "Eurotunnel",
      "Paris Gare du Nord",
      "Geneva Train Station",
      "Geneva Airport Terminal 1",
      "Basel Train Station",
      "Dropboxes",
    ],
    AT: ["Vienna"],
    NL: ["Schiphol Airport"],
    CZ: ["Prague"],
    FI: ["Helsinki-Vantaa International Airport"],
    GR: ["Athens Airport"],
    DK: ["Billund Airport", "Copenhagen Airport"],
  },
};

function buildResource(overrides: LocaleResourceOverrides): LocaleResource {
  const base: LocaleResource = {
    app: {
      title: "Shopper Portal",
      subtitle: "from planet",
    },
    labels: {
      selectLanguage: "Select your language",
      close: "Done",
      getStarted: "Get started",
      continue: "Continue",
      cancel: "Cancel",
      save: "Save",
      back: "Back",
      welcomeHeadline: "Get ready to complete your Tax Free refund",
      welcomeDescription: "Just 3 quick steps. We'll guide you through everything.",
      issuingCountryPrompt: "Where did you receive your Tax Free form?",
      tripDetailsHeading: "Where are you departing the EU from?",
      departureCountryPrompt: "Choose a country of departure",
      departureLocationPrompt: "Select EU departure location",
      departureDatePrompt: "Select departure date",
      repeatFlowMessage: "If you have Tax Free forms from multiple countries, check each country separately.",
      nextAction: "What to do next",
    },
    outcomes: {
      KEEP_FORM: "Keep your form",
      SEND_FORM: "Send your form to Planet",
      keepStepOneTitle: "Get Customs approval at DIVA kiosk",
      keepStepOneDescription: "Departure area, 3rd floor, near check-in desk 200",
      keepStepTwoTitle: "Keep the paper form and complete your refund request in the Shopper Portal",
      keepStepTwoDescription: "No paper submission is required.",
      sendStepOneTitle: "Get Customs approval at DIVA kiosk",
      sendStepOneDescription: "Departure area, 3rd floor, near check-in desk 200",
      sendStepTwoTitle: "Send us the stamped form",
      sendStepTwoDescription: "View the \"Help\" page in our Shopper Portal to find our address",
      primaryActionKeep: "See Customs location",
      secondaryActionKeep: "Add refund details",
      primaryActionSend: "See Customs location",
      secondaryActionSend: "Visit Shopper Portal",
      footerHintSend: "Have Tax Free forms from other countries? Restart the flow to check them.",
    },
    welcomeSteps: [
      {
        icon: "📍",
        title: "Where you shopped",
        description: "Select the country where you received your Tax Free form.",
      },
      {
        icon: "🛫",
        title: "Departure details",
        description: "We'll explain what you need to do before leaving the EU.",
      },
      {
        icon: "ℹ️",
        title: "Next steps",
        description: "Find out what you need for Customs validation.",
      },
    ],
    countries: countryNamesEn,
    departureDetails: departureDetailsDefault,
    localeNames: {
      en: "English",
      es: "Español",
      pt: "Português",
      zh: "简体中文",
      ar: "العربية",
      tr: "Türkçe",
    },
  };

  return {
    ...base,
    ...overrides,
    app: { ...base.app, ...overrides.app },
    labels: { ...base.labels, ...overrides.labels },
    outcomes: { ...base.outcomes, ...overrides.outcomes },
    welcomeSteps: overrides.welcomeSteps ?? base.welcomeSteps,
    countries: overrides.countries ?? base.countries,
    departureDetails: overrides.departureDetails ?? base.departureDetails,
    localeNames: { ...base.localeNames, ...overrides.localeNames },
  };
}

export const localeResources: Record<LocaleCode, LocaleResource> = {
  en: buildResource({}),
  es: buildResource({ app: { subtitle: "de planet" } }),
  pt: buildResource({ app: { subtitle: "da planet" } }),
  zh: buildResource({ app: { subtitle: "来自 planet" } }),
  ar: buildResource({ app: { subtitle: "من planet" } }),
  tr: buildResource({ app: { subtitle: "planet tarafından" } }),
};

export function resolveLocale(locale: string | null | undefined): LocaleCode {
  if (!locale) {
    return "en";
  }

  const candidate = locale.toLowerCase();

  if (candidate in localeResources) {
    return candidate as LocaleCode;
  }

  return "en";
}

export function getLocaleResource(locale: string | null | undefined): LocaleResource {
  return localeResources[resolveLocale(locale)];
}

export function getCountryDisplayName(locale: string | null | undefined, countryCode: string): string {
  const resource = getLocaleResource(locale);
  const normalizedCode = countryCode.trim().toUpperCase();

  return resource.countries[normalizedCode] ?? normalizedCode;
}

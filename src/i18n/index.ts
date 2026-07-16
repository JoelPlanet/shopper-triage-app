import { getCountryDisplayName, getLocaleResource, type LocaleCode, resolveLocale } from "./resources";

export { getCountryDisplayName };

export function getCurrentLocale(selectedLanguage: string | null | undefined): LocaleCode {
  return resolveLocale(selectedLanguage);
}

export function getLocalizedContent(selectedLanguage: string | null | undefined) {
  const locale = getCurrentLocale(selectedLanguage);
  const resource = getLocaleResource(locale);

  return {
    locale,
    app: resource.app,
    labels: resource.labels,
    outcomes: resource.outcomes,
    welcomeSteps: resource.welcomeSteps,
    departureDetails: resource.departureDetails,
    localeNames: resource.localeNames,
  };
}

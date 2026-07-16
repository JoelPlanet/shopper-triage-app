const RTL_LOCALES = new Set(["ar"]);

export function getDocumentDirection(locale: string | null | undefined): "rtl" | "ltr" {
  return locale && RTL_LOCALES.has(locale.toLowerCase()) ? "rtl" : "ltr";
}

export function applyDocumentDirection(locale: string | null | undefined): "rtl" | "ltr" {
  const direction = getDocumentDirection(locale);

  if (typeof document !== "undefined") {
    document.documentElement.dir = direction;

    if (locale) {
      document.documentElement.lang = locale;
    }
  }

  return direction;
}

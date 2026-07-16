import { getCountryDisplayName, type LocaleCode } from "../../i18n/resources";
import { getLocalizedContent } from "../../i18n";
import { MobileFrame } from "../components/MobileFrame";
import { TwoStepIndicator } from "../components/TwoStepIndicator";

interface CountryOption {
  code: string;
}

interface IssuingCountryScreenProps {
  locale: string | null;
  selectedCountryCode: string | null;
  countries: CountryOption[];
  onSelectCountry: (countryCode: string) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function IssuingCountryScreen({
  locale,
  selectedCountryCode,
  countries,
  onSelectCountry,
  onCancel,
  onContinue,
}: IssuingCountryScreenProps) {
  const localized = getLocalizedContent(locale);
  const resolvedLocale = localized.locale as LocaleCode;

  return (
    <MobileFrame title={localized.app.title} subtitle={localized.app.subtitle}>
      <TwoStepIndicator step={1} />

      <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 24, lineHeight: 1.06, textTransform: "none" }}>
        {localized.labels.issuingCountryPrompt}
      </h2>

      <label htmlFor="issuing-country" style={{ fontSize: 16, fontWeight: 600, display: "block" }}>
        {localized.labels.issuingCountryPrompt}
      </label>

      <select
        id="issuing-country"
        value={selectedCountryCode ?? ""}
        onChange={(event) => onSelectCountry(event.target.value)}
        style={{
          marginTop: 8,
          width: "100%",
          borderRadius: 10,
          border: "1px solid #d1d5db",
          padding: "13px 12px",
          fontSize: 17,
          background: "#fff",
        }}
      >
        <option value="">--</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {getCountryDisplayName(resolvedLocale, country.code)}
          </option>
        ))}
      </select>

      <section
        aria-label="Repeat flow notice"
        style={{
          marginTop: 16,
          borderRadius: 10,
          border: "1px solid #93c5fd",
          background: "#e8f3ff",
          padding: "12px 14px",
        }}
      >
        <p style={{ margin: 0, color: "#1f2937", fontSize: 15, lineHeight: 1.3 }}>
          {localized.labels.repeatFlowMessage}
        </p>
      </section>

      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            width: "100%",
            borderRadius: 999,
            border: "1px solid #111827",
            background: "#fff",
            color: "#111827",
            padding: "14px 18px",
            fontSize: 17,
            cursor: "pointer",
          }}
        >
          {localized.labels.cancel}
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedCountryCode}
          style={{
            width: "100%",
            borderRadius: 999,
            border: "1px solid #111827",
            background: selectedCountryCode ? "#111827" : "#d1d5db",
            color: "#fff",
            padding: "14px 18px",
            fontSize: 17,
            cursor: selectedCountryCode ? "pointer" : "not-allowed",
          }}
        >
          {localized.labels.continue}
        </button>
      </div>
    </MobileFrame>
  );
}

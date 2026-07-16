import type { ChangeEvent } from "react";
import { getCountryDisplayName, getLocalizedContent } from "../../i18n";
import { MobileFrame } from "../components/MobileFrame";
import { TwoStepIndicator } from "../components/TwoStepIndicator";

interface CountryOption {
  code: string;
}

interface DepartureCountryScreenProps {
  locale: string | null;
  selectedCountryCode: string | null;
  selectedAirport: string;
  departureDate: string;
  countries: CountryOption[];
  onSelectCountry: (countryCode: string) => void;
  onSelectAirport: (airport: string) => void;
  onSelectDepartureDate: (date: string) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function DepartureCountryScreen({
  locale,
  selectedCountryCode,
  selectedAirport,
  departureDate,
  countries,
  onSelectCountry,
  onSelectAirport,
  onSelectDepartureDate,
  onCancel,
  onContinue,
}: DepartureCountryScreenProps) {
  const localized = getLocalizedContent(locale);
  const resolvedLocale = localized.locale;
  const canSave = Boolean(selectedCountryCode && selectedAirport && departureDate);

  return (
    <MobileFrame title={localized.app.title} subtitle={localized.app.subtitle}>
      <TwoStepIndicator step={2} />

      <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 24, lineHeight: 1.06 }}>
        {localized.labels.tripDetailsHeading}
      </h2>

      <label htmlFor="departure-country" style={{ fontSize: 16, fontWeight: 600, display: "block" }}>
        {localized.labels.departureCountryPrompt}
      </label>

      <select
        id="departure-country"
        value={selectedCountryCode ?? ""}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelectCountry(event.target.value)}
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

      <label
        htmlFor="departure-airport"
        style={{ marginTop: 14, fontSize: 16, fontWeight: 600, display: "block" }}
      >
        {localized.labels.departureLocationPrompt}
      </label>

      <select
        id="departure-airport"
        value={selectedAirport}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelectAirport(event.target.value)}
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
        {(selectedCountryCode ? localized.departureDetails.locationsByCountry[selectedCountryCode] ?? [] : []).map((airport: string) => (
          <option key={airport} value={airport}>
            {airport}
          </option>
        ))}
      </select>

      <label
        htmlFor="departure-date"
        style={{ marginTop: 14, fontSize: 16, fontWeight: 600, display: "block" }}
      >
        {localized.labels.departureDatePrompt}
      </label>

      <input
        id="departure-date"
        type="date"
        value={departureDate}
        onChange={(event) => onSelectDepartureDate(event.target.value)}
        style={{
          marginTop: 8,
          width: "100%",
          borderRadius: 10,
          border: "1px solid #d1d5db",
          padding: "13px 12px",
          fontSize: 17,
          background: "#fff",
        }}
      />

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
          disabled={!canSave}
          style={{
            width: "100%",
            borderRadius: 999,
            border: "1px solid #111827",
            background: canSave ? "#111827" : "#d1d5db",
            color: "#fff",
            padding: "14px 18px",
            fontSize: 17,
            cursor: canSave ? "pointer" : "not-allowed",
          }}
        >
          {localized.labels.save}
        </button>
      </div>
    </MobileFrame>
  );
}

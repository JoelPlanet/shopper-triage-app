import { getLocalizedContent } from "../../i18n";
import { MobileFrame } from "../components/MobileFrame";

interface WelcomeScreenProps {
  locale: string | null;
  onOpenLanguageSelector: () => void;
  onGetStarted: () => void;
}

export function WelcomeScreen({
  locale,
  onOpenLanguageSelector,
  onGetStarted,
}: WelcomeScreenProps) {
  const localized = getLocalizedContent(locale);

  return (
    <MobileFrame title={localized.app.title} subtitle={localized.app.subtitle}>
      <h2 style={{ margin: "0 0 8px", fontSize: 24, lineHeight: 1.03, fontWeight: 700 }}>
        {localized.labels.welcomeHeadline}
      </h2>

      <p style={{ margin: "0 0 18px", color: "#4b5563", fontSize: 16 }}>
        {localized.labels.welcomeDescription}
      </p>

      <section style={{ display: "grid", gap: 14 }}>
        {localized.welcomeSteps.map((step) => (
          <article key={step.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
              aria-hidden="true"
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                background: "#c9d4ff",
                display: "grid",
                placeItems: "center",
                fontSize: 24,
              }}
            >
              {step.icon}
            </div>
            <div>
              <h3 style={{ margin: "2px 0", fontSize: 18, lineHeight: 1.1 }}>{step.title}</h3>
              <p style={{ margin: 0, color: "#4b5563", fontSize: 16, lineHeight: 1.3 }}>
                {step.description}
              </p>
            </div>
          </article>
        ))}
      </section>

      <div style={{ marginTop: 34, display: "grid", gap: 12 }}>
        <button
          type="button"
          onClick={onOpenLanguageSelector}
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
          {localized.labels.selectLanguage}
        </button>

        <button
          type="button"
          onClick={onGetStarted}
          style={{
            width: "100%",
            borderRadius: 999,
            border: "1px solid #111827",
            background: "#000",
            color: "#fff",
            padding: "14px 18px",
            fontSize: 17,
            cursor: "pointer",
          }}
        >
          {localized.labels.getStarted}
        </button>
      </div>
    </MobileFrame>
  );
}
import { getLocalizedContent } from "../../i18n";
import type { LocaleCode } from "../../i18n/resources";

interface LanguageSelectionScreenProps {
  currentLocale: string | null;
  supportedLocales: LocaleCode[];
  onSelectLocale: (locale: LocaleCode) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSelectionScreen({
  currentLocale,
  supportedLocales,
  onSelectLocale,
  isOpen,
  onClose,
}: LanguageSelectionScreenProps) {
  if (!isOpen) {
    return null;
  }

  const localized = getLocalizedContent(currentLocale);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={localized.labels.selectLanguage}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          maxHeight: "74vh",
          overflowY: "auto",
          background: "#fff",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          padding: "20px 18px 24px",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: 18, lineHeight: 1.1, fontWeight: 700 }}>
          {localized.labels.selectLanguage}
        </h2>

        <div role="radiogroup" aria-label={localized.labels.selectLanguage}>
          {supportedLocales.map((locale) => {
            const selected = currentLocale === locale;
            const languageLabel = localized.localeNames[locale];

            return (
              <button
                key={locale}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelectLocale(locale)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "none",
                  borderBottom: "1px solid #ececf2",
                  background: "#fff",
                  padding: "14px 0",
                  fontSize: 14,
                  textAlign: "start",
                  cursor: "pointer",
                }}
              >
                <span>{languageLabel}</span>
                <span aria-hidden="true" style={{ color: selected ? "#5d4fff" : "transparent" }}>
                  ✓
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: 14,
            width: "100%",
            borderRadius: 999,
            border: "1px solid #d1d5db",
            background: "#fff",
            color: "#111827",
            padding: "12px 16px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {localized.labels.close}
        </button>
      </div>
    </div>
  );
}

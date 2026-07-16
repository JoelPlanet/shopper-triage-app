import { useState } from "react";
import { getCountryDisplayName, getLocalizedContent } from "../../i18n";
import type { DynamicInstructionEntry } from "../data/dynamicInstructions";
import { CustomsLocationModal } from "../components/CustomsLocationModal";
import { InstructionMedia } from "../components/InstructionMedia";
import { MobileFrame } from "../components/MobileFrame";

interface KeepFormInstructionsScreenProps {
  locale: string | null;
  selectedDepartureAirport: string;
  selectedIssuingCountryCode: string | null;
  selectedDepartureCountryCode: string | null;
  selectedDepartureInstruction: DynamicInstructionEntry | null;
}

export function KeepFormInstructionsScreen({
  locale,
  selectedDepartureAirport,
  selectedIssuingCountryCode,
  selectedDepartureCountryCode,
  selectedDepartureInstruction,
}: KeepFormInstructionsScreenProps) {
  const localized = getLocalizedContent(locale);
  const [isCustomsLocationOpen, setIsCustomsLocationOpen] = useState(false);

  const fallbackInstruction: DynamicInstructionEntry = {
    countryCode: selectedDepartureCountryCode ?? "",
    country: selectedDepartureCountryCode ?? "",
    airport: selectedDepartureAirport,
    step2Image: "/Spec%20Assets/Decision%20Page%20Images/Step1-2.png",
    step2AdditionalImage: "/Spec%20Assets/Decision%20Page%20Images/Step1-2.png",
    step2Title: localized.outcomes.keepStepOneTitle,
    step2Description: localized.outcomes.keepStepOneDescription,
  };

  const instruction = selectedDepartureInstruction ?? fallbackInstruction;
  const hasCrossBorderOverride = Boolean(
    selectedIssuingCountryCode &&
    selectedDepartureCountryCode &&
    selectedIssuingCountryCode.trim().toUpperCase() !== selectedDepartureCountryCode.trim().toUpperCase(),
  );
  const issuingCountryName = selectedIssuingCountryCode
    ? getCountryDisplayName(localized.locale, selectedIssuingCountryCode)
    : "";
  const stepOneTitle = hasCrossBorderOverride
    ? "Visit Customs in person for a physical stamp"
    : instruction.step2Title;
  const stepOneDescription = hasCrossBorderOverride
    ? `You will need to have a Customs official stamp your paper form from ${issuingCountryName}`
    : instruction.step2Description;
  const stepOneImage = selectedDepartureInstruction
    ? encodeURI(
        `/Spec Assets/Digital Concierge Assets/${selectedDepartureInstruction.country}/${selectedDepartureInstruction.step2Image}`,
      )
    : instruction.step2Image;
  const customsLocationImage = selectedDepartureInstruction?.step2AdditionalImage
    ? encodeURI(
        `/Spec Assets/Digital Concierge Assets/${selectedDepartureInstruction.country}/${selectedDepartureInstruction.step2AdditionalImage}`,
      )
    : stepOneImage;

  return (
    <MobileFrame title={localized.app.title} subtitle={localized.app.subtitle}>
      {!hasCrossBorderOverride ? (
        <CustomsLocationModal
          isOpen={isCustomsLocationOpen}
          title={instruction.step2Title}
          imageSrc={customsLocationImage}
          onClose={() => setIsCustomsLocationOpen(false)}
        />
      ) : null}

      <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 24, lineHeight: 1.05 }}>
        {localized.labels.nextAction}
      </h2>

      <section style={{ marginBottom: 22 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 16, lineHeight: 1.1 }}>
          <span dangerouslySetInnerHTML={{ __html: `1 ${stepOneTitle}` }} />
        </h3>
        {stepOneDescription ? (
          <p style={{ margin: "0 0 14px", color: "#4b5563", fontSize: 14 }}>
            <span dangerouslySetInnerHTML={{ __html: stepOneDescription }} />
          </p>
        ) : null}

        {!hasCrossBorderOverride ? (
          <>
            <InstructionMedia src={stepOneImage} alt={instruction.step2Title} />

            <button
              type="button"
              onClick={() => setIsCustomsLocationOpen(true)}
              style={{
                width: "100%",
                borderRadius: 999,
                border: "1px solid #111827",
                background: "#fff",
                color: "#111827",
                padding: "14px 18px",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {localized.outcomes.primaryActionKeep}
            </button>
          </>
        ) : null}
      </section>

      <section>
        <h3 style={{ margin: "0 0 6px", fontSize: 16, lineHeight: 1.1 }}>
          2 {localized.outcomes.keepStepTwoTitle}
        </h3>

        <div
          style={{
            marginBottom: 14,
            borderRadius: 10,
            border: "1px solid #93c5fd",
            background: "#e8f3ff",
            padding: "10px 12px",
          }}
        >
          <p style={{ margin: 0, color: "#1f2937", fontSize: 14 }}>{localized.outcomes.keepStepTwoDescription}</p>
        </div>

        <img
          src="/Spec%20Assets/Decision%20Page%20Images/Step2-2.png"
          alt="Refund details guidance"
          style={{ width: "100%", borderRadius: 12, marginBottom: 14, display: "block" }}
        />

        <a
          href="https://europe-taxfree.planetpayment.com/ShopperPortalEU/?LT=7"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            borderRadius: 999,
            border: "1px solid #111827",
            background: "#fff",
            color: "#111827",
            padding: "14px 18px",
            fontSize: 16,
            cursor: "pointer",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          {localized.outcomes.secondaryActionKeep}
        </a>
      </section>

      <footer
        style={{
          marginTop: 24,
          borderRadius: 10,
          border: "1px solid #d1d5db",
          background: "#f9fafb",
          padding: "10px 12px",
        }}
      >
        <p style={{ margin: 0, color: "#374151", fontSize: 14 }}>
          {localized.outcomes.footerHintSend}
        </p>
      </footer>
    </MobileFrame>
  );
}

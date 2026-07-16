import { InstructionMedia } from "./InstructionMedia";

interface CustomsLocationModalProps {
  isOpen: boolean;
  title: string;
  imageSrc: string;
  onClose: () => void;
}

export function CustomsLocationModal({ isOpen, title, imageSrc, onClose }: CustomsLocationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(17, 24, 39, 0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 20,
          background: "#fff",
          padding: 16,
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.28)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.1 }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #d1d5db",
              background: "#fff",
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <InstructionMedia src={imageSrc} alt={title} />
      </div>
    </div>
  );
}
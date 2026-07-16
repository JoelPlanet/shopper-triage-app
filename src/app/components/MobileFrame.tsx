import type { ReactNode } from "react";

interface MobileFrameProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  progress?: number;
}

export function MobileFrame({ title, subtitle, children, progress }: MobileFrameProps) {
  return (
    <main
      style={{
        margin: "0 auto",
        width: "100%",
        maxWidth: 420,
        minHeight: "100vh",
        background: "#f4f4f5",
        color: "#151515",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <header
        aria-label={`${title} ${subtitle}`.trim()}
        style={{
          padding: "28px 20px 14px",
          textAlign: "center",
          borderBottom: "1px solid #e5e7eb",
          background: "#f4f4f5",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <img
          src="/Spec%20Assets/shopper-portal-logo.svg"
          alt="Shopper Portal"
          style={{ width: 184, maxWidth: "100%", height: "auto", margin: "0 auto 6px", display: "block" }}
        />
      </header>

      {typeof progress === "number" && (
        <div style={{ padding: "0 20px", background: "#f4f4f5" }}>
          <div
            aria-label="Journey progress"
            style={{
              height: 4,
              width: "100%",
              borderRadius: 999,
              background: "#dddfe3",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, progress))}%`,
                background: "#5d4fff",
              }}
            />
          </div>
        </div>
      )}

      <section style={{ padding: "24px 20px 28px" }}>{children}</section>
    </main>
  );
}

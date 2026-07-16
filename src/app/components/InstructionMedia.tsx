import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface InstructionMediaProps {
  src: string;
  alt: string;
}

function isLottieAsset(src: string): boolean {
  return src.toLowerCase().endsWith(".lottie");
}

export function InstructionMedia({ src, alt }: InstructionMediaProps) {
  const sharedStyle = {
    width: "100%",
    borderRadius: 12,
    display: "block",
    background: "#f9fafb",
  } as const;

  if (isLottieAsset(src)) {
    return (
      <div style={{ ...sharedStyle, overflow: "hidden", aspectRatio: "4 / 3" }}>
        <DotLottieReact src={src} autoplay loop style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ ...sharedStyle, objectFit: "cover" }}
    />
  );
}
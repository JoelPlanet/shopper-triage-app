interface TwoStepIndicatorProps {
  step: 1 | 2;
}

export function TwoStepIndicator({ step }: TwoStepIndicatorProps) {
  return (
    <div
      aria-label={`Step ${step} of 2`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          height: 4,
          borderRadius: 999,
          background: step >= 1 ? "#5d4fff" : "#d8d8de",
        }}
      />
      <div
        style={{
          height: 4,
          borderRadius: 999,
          background: step >= 2 ? "#5d4fff" : "#d8d8de",
        }}
      />
    </div>
  );
}
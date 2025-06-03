interface SpacerProps {
  height?: number;
  width?: number;
}

export function Spacer({ height = 1, width }: SpacerProps) {
  return (
    <div
      style={{
        height: height ? `${height * 0.25}rem` : undefined,
        width: width ? `${width * 0.25}rem` : undefined,
      }}
    />
  );
}

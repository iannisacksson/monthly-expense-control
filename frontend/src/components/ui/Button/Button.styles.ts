import type { CSSProperties } from "react";
import type { ButtonProps } from "./Button.types";

const baseStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: 999,
  border: "1px solid transparent",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 800,
  minHeight: 44,
};

export const styles: Record<NonNullable<ButtonProps["variant"]>, CSSProperties> = {
  primary: { ...baseStyle, background: "var(--brand)", color: "#fffdf8", borderColor: "rgba(23, 63, 66, 0.7)" },
  secondary: { ...baseStyle, background: "rgba(255, 255, 255, 0.8)", color: "var(--text)", borderColor: "var(--line)" },
  danger: { ...baseStyle, background: "rgba(180, 70, 59, 0.08)", color: "var(--danger)", borderColor: "rgba(180, 70, 59, 0.2)" },
};

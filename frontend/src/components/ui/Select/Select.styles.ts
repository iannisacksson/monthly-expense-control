import type { CSSProperties } from "react";

export const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 4,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--text-soft)",
};

export const selectStyle: CSSProperties = {
  display: "block",
  width: "100%",
  minHeight: 46,
  padding: 12,
  fontSize: 14,
  border: "1px solid var(--line)",
  borderRadius: 14,
  boxSizing: "border-box",
  background: "rgba(255, 255, 255, 0.86)",
  color: "var(--text)",
};

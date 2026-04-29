import type { CSSProperties } from "react";

export const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

export const thStyle: CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  borderBottom: "1px solid var(--line)",
  color: "var(--text-soft)",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

export const tdStyle: CSSProperties = {
  padding: "14px 16px",
  borderBottom: "1px solid rgba(73, 85, 99, 0.08)",
};

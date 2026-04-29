import type { CSSProperties } from "react";

export const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(20, 24, 32, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  zIndex: 1000,
};

export const contentStyle: CSSProperties = {
  background: "rgba(255, 251, 247, 0.96)",
  borderRadius: 28,
  minWidth: 400,
  width: "min(760px, 100%)",
  maxWidth: "100%",
  maxHeight: "88vh",
  overflow: "auto",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 24px 60px rgba(18, 23, 31, 0.22)",
};

export const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  padding: "22px 24px 0",
};

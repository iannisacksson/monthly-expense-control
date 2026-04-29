import type { ReactNode, CSSProperties } from "react";

export interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

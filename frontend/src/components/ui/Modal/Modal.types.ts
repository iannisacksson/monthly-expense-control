import type { ReactNode, CSSProperties } from "react";

export interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  style?: CSSProperties;
  className?: string;
}

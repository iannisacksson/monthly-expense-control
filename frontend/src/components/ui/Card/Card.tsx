import { cardStyle } from "./Card.styles";
import type { CardProps } from "./Card.types";

export default function Card({ children, style, className }: CardProps) {
  const classes = ["ui-card", className].filter(Boolean).join(" ");

  return <div className={classes} style={{ ...cardStyle, ...style }}>{children}</div>;
}

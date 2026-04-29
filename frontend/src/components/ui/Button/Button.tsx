import { styles } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

export default function Button({ variant = "primary", style, className, ...props }: ButtonProps) {
  const classes = ["ui-button", `ui-button--${variant}`, className].filter(Boolean).join(" ");

  return <button className={classes} style={{ ...styles[variant], ...style }} {...props} />;
}

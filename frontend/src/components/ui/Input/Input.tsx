import { labelStyle, inputStyle } from "./Input.styles";
import type { InputProps } from "./Input.types";

export default function Input({ label, id, style, ...props }: InputProps) {
  return (
    <div className="ui-field">
      {label && <label htmlFor={id} className="ui-label" style={labelStyle}>{label}</label>}
      <input id={id} className="ui-input" style={{ ...inputStyle, ...style }} {...props} />
    </div>
  );
}

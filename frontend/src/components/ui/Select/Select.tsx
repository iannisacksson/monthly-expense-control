import { labelStyle, selectStyle } from "./Select.styles";
import type { SelectProps } from "./Select.types";

export default function Select({ label, id, options, placeholder, style, ...props }: SelectProps) {
  return (
    <div className="ui-field">
      {label && <label htmlFor={id} className="ui-label" style={labelStyle}>{label}</label>}
      <select id={id} className="ui-select" style={{ ...selectStyle, ...style }} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

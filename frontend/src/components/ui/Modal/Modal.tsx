import { overlayStyle, contentStyle, headerStyle } from "./Modal.styles";
import type { ModalProps } from "./Modal.types";

export default function Modal({ open, title, children, onClose, style, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="ui-modal-overlay" style={overlayStyle} onClick={onClose}>
      <div className={["ui-modal-content", className].filter(Boolean).join(" ")} style={{ ...contentStyle, ...style }} onClick={(e) => e.stopPropagation()}>
        <div className="ui-modal-header" style={headerStyle}>
          <h2 className="ui-modal-title" style={{ margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            className="ui-modal-close"
            style={{ fontSize: 20 }}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  );
}

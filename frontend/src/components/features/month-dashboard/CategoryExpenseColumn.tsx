import { useState } from "react";
import type { Expense } from "../../../types";
import type { MonthExpenseListItem } from "../../../hooks/useMonthDashboardData";
import { formatCurrencyBRL } from "../../../utils/currency";

interface CategoryExpenseColumnProps {
  title: string;
  headerColor: string;
  categoryId?: string;
  expenses: MonthExpenseListItem[];
  defaultExpanded?: boolean;
  selectedExpenseIds?: string[];
  onToggleSelection?: (expenseId: string) => void;
  onAdd: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (expense: Expense) => void;
}

export default function CategoryExpenseColumn({ title, headerColor, expenses, defaultExpanded = false, selectedExpenseIds = [], onToggleSelection, onAdd, onEdit, onDelete, onTogglePaid }: CategoryExpenseColumnProps) {
  const total = expenses.reduce((s, e) => s + Number(e.value), 0);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeExpenseId, setActiveExpenseId] = useState<string | null>(null);

  const getInstallmentLabel = (expense: MonthExpenseListItem) => {
    if (!expense.installment_group_id) {
      return null;
    }

    const match = expense.description.match(/\((\d+\/\d+)\)\s*$/);
    return match ? `(${match[1]})` : null;
  };

  const getExpenseTitle = (expense: MonthExpenseListItem) => (
    getInstallmentLabel(expense)
      ? expense.description.replace(/\s*\(\d+\/\d+\)\s*$/, "").trim()
      : expense.description
  );

  const toggleExpanded = () => {
    setIsExpanded((current) => !current);
    if (isExpanded) {
      setActiveExpenseId(null);
    }
  };

  return (
    <section style={{ border: "1px solid var(--line)", borderRadius: 22, overflow: "hidden", background: "#fffdf8", boxShadow: "0 12px 28px rgba(15, 23, 42, 0.07)", minWidth: 0, width: "100%", minHeight: 320, display: "flex", flexDirection: "column" }}>
      <div style={{ background: headerColor, color: "#fff", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <button
          type="button"
          onClick={toggleExpanded}
          style={{ background: "transparent", border: "none", color: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flex: 1, minWidth: 0, padding: 0, cursor: "pointer", textAlign: "left" }}
          aria-expanded={isExpanded}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>{title}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6, fontSize: 12, opacity: 0.92 }}>
              <span>{expenses.length} {expenses.length === 1 ? "lançamento" : "lançamentos"}</span>
              <span>{formatCurrencyBRL(total)}</span>
            </div>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{isExpanded ? "−" : "+"}</span>
        </button>

        <button
          type="button"
          onClick={onAdd}
          style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: 999, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}
        >
          Adicionar
        </button>
      </div>

      {isExpanded && (
        <div style={{ background: "#fffdf8", flex: 1 }}>
          {expenses.length === 0 && (
            <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, padding: 16 }}>Nenhuma despesa neste grupo.</p>
          )}

          {expenses.map((e, index) => {
            const isActionOpen = activeExpenseId === e.id;
            const isSelected = selectedExpenseIds.includes(e.id);
            const cardBackground = e.is_paid ? "#b7e1cd" : "#fffdf8";
            const cardBorder = e.is_paid ? "#8fbfa9" : "#f1f5f9";
            const primaryText = e.is_paid ? "#254b38" : "#24303f";
            const secondaryText = e.is_paid ? "#3f6651" : "#5f6c7b";
            const installmentLabel = getInstallmentLabel(e);
            return (
              <div key={e.id} style={{ borderTop: index === 0 ? "none" : "1px solid #f1f5f9", background: cardBackground }}>
                <div style={{ padding: "16px 18px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: isActionOpen ? `1px solid ${cardBorder}` : "none" }}>
                  {onToggleSelection && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleSelection(e.id);
                      }}
                      aria-label={`Selecionar despesa ${e.description}`}
                      aria-pressed={isSelected}
                      style={{
                        width: 40,
                        minWidth: 40,
                        height: 40,
                        borderRadius: 12,
                        border: isSelected ? "1px solid #5d8f78" : "1px solid #c8d2de",
                        background: isSelected ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.72)",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        padding: 0,
                        boxShadow: isSelected ? "inset 0 1px 0 rgba(255,255,255,0.32)" : "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelection(e.id)}
                        tabIndex={-1}
                        style={{ pointerEvents: "none", margin: 0, width: 24, height: 24 }}
                        aria-hidden="true"
                      />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveExpenseId((current) => current === e.id ? null : e.id)}
                    style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                    aria-expanded={isActionOpen}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "baseline" }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: primaryText,
                              lineHeight: 1.35,
                              wordBreak: "break-word",
                            }}
                          >
                            {getExpenseTitle(e)}
                          </div>
                          {installmentLabel && (
                            <span style={{ fontSize: 13, fontWeight: 700, color: secondaryText }}>
                              {installmentLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: primaryText, whiteSpace: "nowrap" }}>
                          {formatCurrencyBRL(Number(e.value))}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {isActionOpen && (
                  <div style={{ padding: "0 18px 16px 40px", display: "flex", gap: 8, flexWrap: "wrap", background: cardBackground }}>
                    <button
                      type="button"
                      onClick={() => onTogglePaid(e)}
                      style={{ background: e.is_paid ? "rgba(255,255,255,0.35)" : "#f8fafc", border: `1px solid ${e.is_paid ? "#7da88f" : "#cbd5e1"}`, cursor: "pointer", fontSize: 12, color: e.is_paid ? "#254b38" : "#334155", borderRadius: 999, padding: "7px 12px", fontWeight: 700 }}
                    >
                      {e.is_paid ? "Desmarcar pagamento" : "Pagar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(e)}
                      style={{ background: e.is_paid ? "rgba(255,255,255,0.35)" : "#fff", border: "1px solid #cbd5e1", cursor: "pointer", fontSize: 12, color: e.is_paid ? "#305540" : "#334155", borderRadius: 999, padding: "7px 12px", fontWeight: 700 }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(e.id)}
                      style={{ background: e.is_paid ? "rgba(255,255,255,0.35)" : "#fff", border: "1px solid #e9b9b4", cursor: "pointer", fontSize: 12, color: e.is_paid ? "#8a3b34" : "#a1463c", borderRadius: 999, padding: "7px 12px", fontWeight: 700 }}
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

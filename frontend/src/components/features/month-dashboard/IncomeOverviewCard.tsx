import type { MonthlyIncome, IncomeTax } from "../../../types";

interface IncomeOverviewCardProps {
  incomes: MonthlyIncome[];
  taxes: IncomeTax[];
  onAddIncome: () => void;
  onEditIncome: (income: MonthlyIncome) => void;
  onManageTaxes: (income: MonthlyIncome) => void;
  onDeleteIncome: (id: string) => void;
}

const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function IncomeOverviewCard({ incomes, taxes, onAddIncome, onEditIncome, onManageTaxes, onDeleteIncome }: IncomeOverviewCardProps) {
  const grossTotal = incomes.reduce((s, i) => s + Number(i.gross_income), 0);
  const totalTaxes = taxes.reduce((s, t) => s + Number(t.value), 0);
  const netIncome = grossTotal - totalTaxes;

  const taxesByIncomeId: Record<string, number> = {};
  const taxesByType: Record<string, number> = {};
  taxes.forEach((t) => {
    taxesByIncomeId[t.monthly_income_id] = (taxesByIncomeId[t.monthly_income_id] ?? 0) + Number(t.value);
    taxesByType[t.tax_type] = (taxesByType[t.tax_type] ?? 0) + Number(t.value);
  });

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", minWidth: 220 }}>
      {/* Receita header */}
      <div style={{ background: "#991b1b", color: "#fff", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Receita</span>
        <button
          onClick={onAddIncome}
          style={{ background: "none", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 12 }}
        >
          Nova receita
        </button>
      </div>

      <div style={{ padding: "8px 12px" }}>
        {/* Income entries */}
        {incomes.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "8px 0" }}>Nenhuma receita cadastrada</p>
        )}
        {incomes.map((inc) => (
          <div key={inc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{inc.income_type}</span>
              {inc.notes && <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>({inc.notes})</span>}
              {inc.recurring_income_id && <span style={{ fontSize: 11, color: "#047857", marginLeft: 6, fontWeight: 600 }}>recorrente</span>}
              <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 11, color: "#6b7280", flexWrap: "wrap" }}>
                <span>Bruto: R$ {fmt(Number(inc.gross_income))}</span>
                <span>Impostos: R$ {fmt(taxesByIncomeId[inc.id] ?? 0)}</span>
                <span style={{ color: "#166534", fontWeight: 600 }}>
                  Líquido: R$ {fmt(Number(inc.gross_income) - (taxesByIncomeId[inc.id] ?? 0))}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => onManageTaxes(inc)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb" }} title="Gerenciar impostos">Impostos</button>
              <button onClick={() => onEditIncome(inc)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#6b7280" }} title="Editar">✏️</button>
              <button onClick={() => onDeleteIncome(inc.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#6b7280" }} title="Excluir">🗑️</button>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontWeight: 700, fontSize: 13, color: "#16a34a", borderTop: "2px solid #e5e7eb", marginTop: 4 }}>
          <span>Total</span>
          <span>R$ {fmt(grossTotal)}</span>
        </div>
      </div>

      {/* Impostos */}
      <div style={{ background: "#991b1b", color: "#fff", padding: "8px 12px" }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Impostos</span>
      </div>
      <div style={{ padding: "8px 12px" }}>
        {Object.keys(taxesByType).length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "8px 0" }}>Nenhum imposto</p>
        )}
        {Object.entries(taxesByType).map(([type, val]) => (
          <div key={type} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13 }}>{type}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#dc2626" }}>R$ {fmt(val)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontWeight: 700, fontSize: 13, color: "#dc2626", borderTop: "2px solid #e5e7eb", marginTop: 4 }}>
          <span>Total</span>
          <span>R$ {fmt(totalTaxes)}</span>
        </div>
      </div>

      {/* Receita Líquida */}
      <div style={{ background: "#f0fdf4", padding: "10px 12px", borderTop: "2px solid #16a34a" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#166534" }}>Receita Líquida</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#16a34a" }}>R$ {fmt(netIncome)}</span>
        </div>
      </div>
    </div>
  );
}

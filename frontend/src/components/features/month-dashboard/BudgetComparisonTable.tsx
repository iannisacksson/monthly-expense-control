import type { BudgetAllocation, Category } from "../../../types";

interface BudgetComparisonTableProps {
  allocations: BudgetAllocation[];
  categories: Category[];
  realizedByCategory: Record<string, number>;
  planningBaseIncome: number;
  totalTaxes: number;
  ruleName?: string;
}

const TYPE_LABELS: Record<string, string> = {
  essential: "Essenciais",
  necessary: "Necessários",
  lifestyle: "Supérfluos",
  investment: "Investimentos",
};

const TYPE_ORDER = ["essential", "necessary", "lifestyle", "investment"];

const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function BudgetComparisonTable({ allocations, categories, realizedByCategory, planningBaseIncome, totalTaxes, ruleName }: BudgetComparisonTableProps) {
  if (allocations.length === 0) {
    return (
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, textAlign: "center", color: "#9ca3af" }}>
        <p style={{ margin: 0, fontSize: 14 }}>Nenhuma regra de orçamento configurada.</p>
        <p style={{ margin: "4px 0 0", fontSize: 12 }}>Configure alocações de orçamento para ver a comparação.</p>
      </div>
    );
  }

  const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]));
  const rowsByCategory = new Map<string, { categoryId: string; categoryName: string; categoryType: string; pct: number; ideal: number; spent: number; remaining: number }>();

  allocations.forEach((allocation) => {
    const category = categoryMap[allocation.category_id];
    if (!category) {
      return;
    }

    const pct = Number(allocation.percentage);
    const ideal = planningBaseIncome * (pct / 100);
    const spent = realizedByCategory[allocation.category_id] ?? 0;

    rowsByCategory.set(allocation.category_id, {
      categoryId: allocation.category_id,
      categoryName: category.name,
      categoryType: category.type,
      pct,
      ideal,
      spent,
      remaining: ideal - spent,
    });
  });

  Object.entries(realizedByCategory).forEach(([categoryId, spent]) => {
    if (rowsByCategory.has(categoryId)) {
      return;
    }

    const category = categoryMap[categoryId];
    if (!category) {
      return;
    }

    rowsByCategory.set(categoryId, {
      categoryId,
      categoryName: category.name,
      categoryType: category.type,
      pct: 0,
      ideal: 0,
      spent,
      remaining: -spent,
    });
  });

  const rows = Array.from(rowsByCategory.values()).sort((left, right) => {
    const typeDelta = TYPE_ORDER.indexOf(left.categoryType as keyof typeof TYPE_LABELS) - TYPE_ORDER.indexOf(right.categoryType as keyof typeof TYPE_LABELS);
    if (typeDelta !== 0) {
      return typeDelta;
    }

    return left.categoryName.localeCompare(right.categoryName, "pt-BR");
  });

  let totalPct = 0;
  let totalIdeal = 0;
  let totalSpent = 0;

  rows.forEach((row) => {
    totalPct += row.pct;
    totalIdeal += row.ideal;
    totalSpent += row.spent;
  });

  const totalRemaining = totalIdeal - totalSpent;

  const cellStyle = { padding: "8px 12px", fontSize: 13, borderBottom: "1px solid #f3f4f6" } as const;
  const headerCell = { ...cellStyle, fontWeight: 700, fontSize: 12, textTransform: "uppercase" as const, color: "#6b7280", background: "#f9fafb", borderBottom: "2px solid #e5e7eb" };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ background: "#991b1b", color: "#fff", padding: "8px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Planejamento do Mês</span>
          {ruleName && <span style={{ fontSize: 12, opacity: 0.9 }}>Regra: {ruleName}</span>}
        </div>
      </div>
      <div style={{ padding: "10px 12px", background: "#fff7ed", borderBottom: "1px solid #fed7aa", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 13, color: "#9a3412" }}>
        <span>Base líquida considerada: R$ {fmt(planningBaseIncome)}</span>
        <span>Impostos descontados antes do comparativo: R$ {fmt(totalTaxes)}</span>
        <span>Percentual planejado: {totalPct.toFixed(2)}%</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...headerCell, textAlign: "left" }}>Categoria</th>
            <th style={{ ...headerCell, textAlign: "left" }}>Tipo</th>
            <th style={{ ...headerCell, textAlign: "right" }}>%</th>
            <th style={{ ...headerCell, textAlign: "right" }}>Planejado</th>
            <th style={{ ...headerCell, textAlign: "right" }}>Realizado</th>
            <th style={{ ...headerCell, textAlign: "right" }}>Diferença</th>
            <th style={{ ...headerCell, textAlign: "left" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.categoryId}>
              <td style={{ ...cellStyle, fontWeight: 500 }}>{r.categoryName}</td>
              <td style={{ ...cellStyle }}>{TYPE_LABELS[r.categoryType] ?? r.categoryType}</td>
              <td style={{ ...cellStyle, textAlign: "right" }}>{r.pct.toFixed(0)}%</td>
              <td style={{ ...cellStyle, textAlign: "right" }}>R$ {fmt(r.ideal)}</td>
              <td style={{ ...cellStyle, textAlign: "right" }}>R$ {fmt(r.spent)}</td>
              <td style={{ ...cellStyle, textAlign: "right", fontWeight: 600, color: r.remaining >= 0 ? "#16a34a" : "#dc2626" }}>
                {r.remaining >= 0 ? "" : "-"}R$ {fmt(Math.abs(r.remaining))}
              </td>
              <td style={{ ...cellStyle, color: r.remaining >= 0 ? "#166534" : "#991b1b", fontWeight: 600 }}>
                {r.remaining >= 0 ? "Dentro do planejado" : "Acima do planejado"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f9fafb" }}>
            <td style={{ ...cellStyle, fontWeight: 700, borderBottom: "none" }}>Total</td>
            <td style={{ ...cellStyle, borderBottom: "none" }} />
            <td style={{ ...cellStyle, textAlign: "right", fontWeight: 700, borderBottom: "none" }}>{totalPct.toFixed(0)}%</td>
            <td style={{ ...cellStyle, textAlign: "right", fontWeight: 700, borderBottom: "none" }}>R$ {fmt(totalIdeal)}</td>
            <td style={{ ...cellStyle, textAlign: "right", fontWeight: 700, borderBottom: "none" }}>R$ {fmt(totalSpent)}</td>
            <td style={{ ...cellStyle, textAlign: "right", fontWeight: 700, borderBottom: "none", color: totalRemaining >= 0 ? "#16a34a" : "#dc2626" }}>
              {totalRemaining >= 0 ? "" : "-"}R$ {fmt(Math.abs(totalRemaining))}
            </td>
            <td style={{ ...cellStyle, borderBottom: "none", fontWeight: 700, color: totalRemaining >= 0 ? "#166534" : "#991b1b" }}>
              {totalRemaining >= 0 ? "Dentro do planejado" : "Acima do planejado"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

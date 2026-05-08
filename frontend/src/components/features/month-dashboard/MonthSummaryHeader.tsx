interface MonthSummaryHeaderProps {
  grossIncome: number;
  totalTaxes: number;
  netIncome: number;
  totalPlanned: number;
  totalExpenses: number;
  balance: number;
}

const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MonthSummaryHeader({ grossIncome, totalTaxes, netIncome, totalPlanned, totalExpenses, balance }: MonthSummaryHeaderProps) {
  const cards: { label: string; value: number; color: string; bg: string }[] = [
    { label: "Receita Bruta", value: grossIncome, color: "#16a34a", bg: "#f0fdf4" },
    { label: "Impostos", value: totalTaxes, color: "#dc2626", bg: "#fef2f2" },
    { label: "Salário Líquido", value: netIncome, color: "#2563eb", bg: "#eff6ff" },
    { label: "Total Planejado", value: totalPlanned, color: "#b45309", bg: "#fff7ed" },
    { label: "Total Gastos", value: totalExpenses, color: "#dc2626", bg: "#fef2f2" },
    { label: "Saldo", value: balance, color: balance >= 0 ? "#16a34a" : "#dc2626", bg: balance >= 0 ? "#f0fdf4" : "#fef2f2" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: c.bg,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "12px 16px",
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {c.label}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: c.color }}>
            R$ {fmt(c.value)}
          </p>
        </div>
      ))}
    </div>
  );
}

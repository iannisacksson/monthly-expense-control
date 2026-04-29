import type { Debt } from "../../../types";

interface DebtsSummaryCardProps {
  debts: Debt[];
}

const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function DebtsSummaryCard({ debts }: DebtsSummaryCardProps) {
  const pendingDebts = debts.filter((d) => d.status === "pending");
  const total = pendingDebts.reduce((s, d) => s + Number(d.value), 0);

  if (debts.length === 0) return null;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ background: "#991b1b", color: "#fff", padding: "8px 12px" }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Empréstimos</span>
      </div>
      <div style={{ padding: "8px 12px" }}>
        {debts.map((d) => (
          <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13 }}>{d.creditor_id.slice(0, 8)}…</span>
              <span
                style={{
                  fontSize: 10,
                  padding: "1px 6px",
                  borderRadius: 4,
                  fontWeight: 600,
                  background: d.status === "paid" ? "#dcfce7" : "#fef3c7",
                  color: d.status === "paid" ? "#166534" : "#92400e",
                }}
              >
                {d.status === "paid" ? "Pago" : "Pendente"}
              </span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#dc2626" }}>
              R$ {fmt(Number(d.value))}
            </span>
          </div>
        ))}
      </div>
      {pendingDebts.length > 0 && (
        <div style={{ background: "#fef2f2", padding: "8px 12px", display: "flex", justifyContent: "space-between", borderTop: "2px solid #dc2626" }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#991b1b" }}>Total Pendente</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#dc2626" }}>R$ {fmt(total)}</span>
        </div>
      )}
    </div>
  );
}

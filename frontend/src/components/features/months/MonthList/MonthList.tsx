import Table from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import type { TableColumn } from "../../../ui/Table/Table.types";
import type { Month } from "../../../../types";

const MONTH_NAMES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface MonthListProps {
  months: Month[];
  onEdit: (month: Month) => void;
  onFinalize: (month: Month) => void;
  onSelect: (month: Month) => void;
}

export default function MonthList({ months, onEdit, onFinalize, onSelect }: MonthListProps) {
  const columns: TableColumn<Month>[] = [
    {
      key: "period",
      header: "Período",
      render: (m) => (
        <button
          onClick={() => onSelect(m)}
          style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: 600, padding: 0 }}
        >
          {MONTH_NAMES[m.month]} {m.year}
        </button>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (m) => (
        <span style={{
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 13,
          background: m.status === "open" ? "#dcfce7" : "#f3f4f6",
          color: m.status === "open" ? "#16a34a" : "#6b7280",
        }}>
          {m.status === "open" ? "Aberto" : "Fechado"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      render: (m) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => onEdit(m)}>Editar</Button>
          {m.status === "open" && (
            <Button variant="primary" onClick={() => onFinalize(m)}>Finalizar</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={months}
      rowKey={(m) => m.id}
      emptyMessage="Nenhum mês cadastrado."
    />
  );
}

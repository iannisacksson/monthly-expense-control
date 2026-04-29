import Table from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import type { TableColumn } from "../../../ui/Table/Table.types";
import type { BudgetRule } from "../../../../types";

interface BudgetRuleListProps {
  rules: BudgetRule[];
  selectedRuleId?: string;
  onSelect: (rule: BudgetRule) => void;
  onEdit: (rule: BudgetRule) => void;
  onDelete: (id: string) => void;
}

export default function BudgetRuleList({ rules, selectedRuleId, onSelect, onEdit, onDelete }: BudgetRuleListProps) {
  const columns: TableColumn<BudgetRule>[] = [
    {
      key: "name",
      header: "Regra",
      render: (rule) => (
        <button
          onClick={() => onSelect(rule)}
          style={{
            background: selectedRuleId === rule.id ? "#eff6ff" : "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: 600,
            padding: 0,
          }}
        >
          {rule.name}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      render: (rule) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => onEdit(rule)}>Editar</Button>
          <Button variant="danger" onClick={() => onDelete(rule.id)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={rules} rowKey={(rule) => rule.id} emptyMessage="Nenhuma regra cadastrada." />;
}
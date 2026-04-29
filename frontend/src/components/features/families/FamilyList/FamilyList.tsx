import Table from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import type { TableColumn } from "../../../ui/Table/Table.types";
import type { Family } from "../../../../types";

interface FamilyListProps {
  families: Family[];
  onEdit: (family: Family) => void;
  onDelete: (id: string) => void;
  onSelect: (family: Family) => void;
}

export default function FamilyList({ families, onEdit, onDelete, onSelect }: FamilyListProps) {
  const columns: TableColumn<Family>[] = [
    {
      key: "name",
      header: "Nome",
      render: (f) => (
        <button
          onClick={() => onSelect(f)}
          style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: 600, padding: 0 }}
        >
          {f.name}
        </button>
      ),
    },
    {
      key: "created_at",
      header: "Criada em",
      render: (f) => new Date(f.created_at).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      header: "Ações",
      render: (f) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => onEdit(f)}>Editar</Button>
          <Button variant="danger" onClick={() => onDelete(f.id)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={families}
      rowKey={(f) => f.id}
      emptyMessage="Nenhuma família cadastrada."
    />
  );
}

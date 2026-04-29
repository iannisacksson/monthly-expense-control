import Table from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import type { TableColumn } from "../../../ui/Table/Table.types";
import type { Category } from "../../../../types";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onSelect: (category: Category) => void;
}

const TYPE_LABELS: Record<string, string> = {
  essential: "Essencial",
  necessary: "Necessário",
  lifestyle: "Estilo de Vida",
  investment: "Investimento",
};

export default function CategoryList({ categories, onEdit, onDelete, onSelect }: CategoryListProps) {
  const columns: TableColumn<Category>[] = [
    {
      key: "name",
      header: "Nome",
      render: (c) => (
        <button
          onClick={() => onSelect(c)}
          style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: 600, padding: 0 }}
        >
          {c.name}
        </button>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (c) => TYPE_LABELS[c.type] ?? c.type,
    },
    {
      key: "actions",
      header: "Ações",
      render: (c) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => onEdit(c)}>Editar</Button>
          <Button variant="danger" onClick={() => onDelete(c.id)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={categories}
      rowKey={(c) => c.id}
      emptyMessage="Nenhuma categoria cadastrada."
    />
  );
}

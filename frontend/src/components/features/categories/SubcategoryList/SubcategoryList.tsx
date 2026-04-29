import Table from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import type { TableColumn } from "../../../ui/Table/Table.types";
import type { Subcategory } from "../../../../types";

interface SubcategoryListProps {
  subcategories: Subcategory[];
  onEdit: (subcategory: Subcategory) => void;
  onDelete: (id: string) => void;
}

export default function SubcategoryList({ subcategories, onEdit, onDelete }: SubcategoryListProps) {
  const columns: TableColumn<Subcategory>[] = [
    {
      key: "name",
      header: "Nome",
      render: (s) => s.name,
    },
    {
      key: "actions",
      header: "Ações",
      render: (s) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => onEdit(s)}>Editar</Button>
          <Button variant="danger" onClick={() => onDelete(s.id)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={subcategories}
      rowKey={(s) => s.id}
      emptyMessage="Nenhuma subcategoria cadastrada."
    />
  );
}

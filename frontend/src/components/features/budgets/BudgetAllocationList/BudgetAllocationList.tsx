import Table from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import type { TableColumn } from "../../../ui/Table/Table.types";
import type { BudgetAllocation, Category } from "../../../../types";

interface BudgetAllocationListProps {
  allocations: BudgetAllocation[];
  categories: Category[];
  onEdit: (allocation: BudgetAllocation) => void;
  onDelete: (id: string) => void;
}

export default function BudgetAllocationList({ allocations, categories, onEdit, onDelete }: BudgetAllocationListProps) {
  const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]));

  const columns: TableColumn<BudgetAllocation>[] = [
    {
      key: "category",
      header: "Categoria",
      render: (allocation) => {
        const category = categoryMap[allocation.category_id];
        return category ? `${category.name} (${category.type})` : allocation.category_id;
      },
    },
    {
      key: "percentage",
      header: "Percentual",
      render: (allocation) => `${Number(allocation.percentage).toFixed(2)}%`,
    },
    {
      key: "actions",
      header: "Ações",
      render: (allocation) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => onEdit(allocation)}>Editar</Button>
          <Button variant="danger" onClick={() => onDelete(allocation.id)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={allocations} rowKey={(allocation) => allocation.id} emptyMessage="Nenhuma alocação cadastrada." />;
}
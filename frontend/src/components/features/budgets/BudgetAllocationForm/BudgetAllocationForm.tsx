import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Button from "../../../ui/Button/Button";
import type { BudgetAllocation, Category, CreateBudgetAllocationDTO } from "../../../../types";

interface BudgetAllocationFormProps {
  ruleId: string;
  categories: Category[];
  initialData?: BudgetAllocation;
  onSubmit: (data: CreateBudgetAllocationDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function BudgetAllocationForm({ ruleId, categories, initialData, onSubmit, onCancel, isPending }: BudgetAllocationFormProps) {
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [percentage, setPercentage] = useState(initialData?.percentage?.toString() ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ budget_rule_id: ruleId, category_id: categoryId, percentage: Number(percentage) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <Select
        id="budget-allocation-category"
        label="Categoria"
        options={categories.map((category) => ({ value: category.id, label: `${category.name} (${category.type})` }))}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder="Selecione a categoria"
        required
      />
      <Input
        id="budget-allocation-percentage"
        label="Percentual"
        type="number"
        min="0.01"
        max="100"
        step="0.01"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        required
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : initialData ? "Salvar" : "Criar"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>Cancelar</Button>
      </div>
    </form>
  );
}
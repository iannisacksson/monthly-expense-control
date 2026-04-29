import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import type { BudgetRule, CreateBudgetRuleDTO } from "../../../../types";

interface BudgetRuleFormProps {
  familyId: string;
  initialData?: BudgetRule;
  onSubmit: (data: CreateBudgetRuleDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function BudgetRuleForm({ familyId, initialData, onSubmit, onCancel, isPending }: BudgetRuleFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ family_id: familyId, name });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <Input id="budget-rule-name" label="Nome da regra" value={name} onChange={(e) => setName(e.target.value)} required />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : initialData ? "Salvar" : "Criar"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>Cancelar</Button>
      </div>
    </form>
  );
}
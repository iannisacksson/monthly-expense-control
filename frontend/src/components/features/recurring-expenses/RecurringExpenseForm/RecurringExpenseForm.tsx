import { useEffect, useMemo, useState, type FormEvent } from "react";
import Button from "../../../ui/Button/Button";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import { formatCurrencyBRL, parseCurrencyInputToNumber, toCurrencyInputValue } from "../../../../utils/currency";
import type {
  Category,
  CreateRecurringExpenseDTO,
  RecurringExpense,
  Subcategory,
} from "../../../../types";

interface RecurringExpenseFormProps {
  userId?: string;
  monthId: string;
  categories: Category[];
  subcategories: Subcategory[];
  memberOptions: { value: string; label: string }[];
  initialData?: RecurringExpense;
  onSubmit: (data: CreateRecurringExpenseDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

const statusOptions = [
  { value: "active", label: "Ativa" },
  { value: "inactive", label: "Inativa" },
];

export default function RecurringExpenseForm({
  userId,
  monthId,
  categories,
  subcategories,
  memberOptions,
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: RecurringExpenseFormProps) {
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(initialData?.subcategory_id ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [valueInput, setValueInput] = useState(toCurrencyInputValue(initialData?.value));
  const [status, setStatus] = useState(initialData?.status ?? "active");
  const [paidBy, setPaidBy] = useState(initialData?.paid_by ?? "");
  const [responsibleUserId, setResponsibleUserId] = useState(initialData?.responsible_user_id ?? "");

  const filteredSubcategories = useMemo(
    () => subcategories.filter((subcategory) => subcategory.category_id === categoryId),
    [categoryId, subcategories]
  );

  useEffect(() => {
    if (subcategoryId && !filteredSubcategories.some((subcategory) => subcategory.id === subcategoryId)) {
      setSubcategoryId("");
    }
  }, [filteredSubcategories, subcategoryId]);

  const categoryOptions = categories.map((category) => ({ value: category.id, label: category.name }));
  const subcategoryOptions = filteredSubcategories.map((subcategory) => ({ value: subcategory.id, label: subcategory.name }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit({
      user_id: userId,
      description,
      value: parseCurrencyInputToNumber(valueInput),
      category_id: categoryId,
      subcategory_id: subcategoryId || undefined,
      paid_by: paidBy || undefined,
      responsible_user_id: responsibleUserId || undefined,
      start_month_id: initialData?.start_month_id ?? monthId,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
      <Input
        id="recurring-description"
        label="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <Input
          id="recurring-value"
          label="Valor (R$)"
          inputMode="numeric"
          value={valueInput}
          onChange={(event) => setValueInput(toCurrencyInputValue(parseCurrencyInputToNumber(event.target.value)))}
          required
        />
      </div>
      <Select
        id="recurring-status"
        label="Status"
        options={statusOptions}
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        required
      />
      <Select
        id="recurring-category"
        label="Categoria"
        options={categoryOptions}
        placeholder="Selecione uma categoria"
        value={categoryId}
        onChange={(event) => { setCategoryId(event.target.value); setSubcategoryId(""); }}
        required
      />
      <Select
        id="recurring-subcategory"
        label="Subcategoria"
        options={subcategoryOptions}
        placeholder={subcategoryOptions.length > 0 ? "Selecione (opcional)" : "Nenhuma subcategoria disponível"}
        value={subcategoryId}
        onChange={(event) => setSubcategoryId(event.target.value)}
        disabled={!categoryId || subcategoryOptions.length === 0}
      />
      {memberOptions.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <Select
            id="recurring-paid-by"
            label="Pago por"
            options={memberOptions}
            placeholder="Selecione (opcional)"
            value={paidBy}
            onChange={(event) => setPaidBy(event.target.value)}
          />
          <Select
            id="recurring-responsible-user"
            label="Responsável"
            options={memberOptions}
            placeholder="Selecione (opcional)"
            value={responsibleUserId}
            onChange={(event) => setResponsibleUserId(event.target.value)}
          />
        </div>
      )}
      <div style={{ border: "1px solid #d1fae5", background: "#ecfdf5", borderRadius: 8, padding: 12, fontSize: 13, color: "#065f46" }}>
        {status === "active"
          ? `Ao salvar, a despesa continuará aparecendo nos próximos meses enquanto estiver ativa. Valor atual: ${formatCurrencyBRL(parseCurrencyInputToNumber(valueInput))}.`
          : "A definição ficará salva, mas não lançará despesas enquanto estiver inativa."}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : initialData ? "Salvar recorrência" : "Criar recorrência"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
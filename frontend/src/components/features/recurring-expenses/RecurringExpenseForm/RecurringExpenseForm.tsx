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
  initialData?: RecurringExpense;
  forcedExpenseKind?: "standard" | "envelope";
  hideExpenseKindField?: boolean;
  hideValueField?: boolean;
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
  initialData,
  forcedExpenseKind,
  hideExpenseKindField = false,
  hideValueField = false,
  onSubmit,
  onCancel,
  isPending,
}: RecurringExpenseFormProps) {
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(initialData?.subcategory_id ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [expenseKind, setExpenseKind] = useState<"standard" | "envelope">((forcedExpenseKind ?? initialData?.expense_kind ?? "standard") as "standard" | "envelope");
  const [valueInput, setValueInput] = useState(toCurrencyInputValue(initialData?.value));
  const [plannedAmountInput, setPlannedAmountInput] = useState(toCurrencyInputValue(initialData?.planned_amount ?? undefined));
  const [status, setStatus] = useState(initialData?.status ?? "active");

  const filteredSubcategories = useMemo(
    () => subcategories.filter((subcategory) => subcategory.category_id === categoryId),
    [categoryId, subcategories]
  );

  useEffect(() => {
    if (subcategoryId && !filteredSubcategories.some((subcategory) => subcategory.id === subcategoryId)) {
      setSubcategoryId("");
    }
  }, [filteredSubcategories, subcategoryId]);

  useEffect(() => {
    if (forcedExpenseKind) {
      setExpenseKind(forcedExpenseKind);
    }
  }, [forcedExpenseKind]);

  const categoryOptions = categories.map((category) => ({ value: category.id, label: category.name }));
  const subcategoryOptions = filteredSubcategories.map((subcategory) => ({ value: subcategory.id, label: subcategory.name }));
  const expenseKindOptions = [
    { value: "standard", label: "Despesa padrão" },
    { value: "envelope", label: "Envelope" },
  ];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const resolvedValue = hideValueField ? (initialData?.value ?? 0) : parseCurrencyInputToNumber(valueInput);

    onSubmit({
      user_id: userId,
      description,
      value: resolvedValue,
      expense_kind: expenseKind,
      planned_amount: expenseKind === "envelope" ? parseCurrencyInputToNumber(plannedAmountInput) : undefined,
      category_id: categoryId,
      subcategory_id: subcategoryId || undefined,
      start_month_id: initialData?.start_month_id ?? monthId,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
      {!hideExpenseKindField && !forcedExpenseKind && (
        <Select
          id="recurring-expense-kind"
          label="Tipo"
          options={expenseKindOptions}
          value={expenseKind}
          onChange={(event) => setExpenseKind(event.target.value as "standard" | "envelope")}
          required
        />
      )}
      <Input
        id="recurring-description"
        label="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      />
      <div style={{ display: "grid", gridTemplateColumns: expenseKind === "envelope" ? "repeat(1, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        {!hideValueField && (
          <Input
            id="recurring-value"
            label={expenseKind === "envelope" ? "Valor atual (R$)" : "Valor (R$)"}
            inputMode="numeric"
            value={valueInput}
            onChange={(event) => setValueInput(toCurrencyInputValue(parseCurrencyInputToNumber(event.target.value)))}
            required
          />
        )}
        {expenseKind === "envelope" && (
          <Input
            id="recurring-planned-amount"
            label="Valor planejado (R$)"
            inputMode="numeric"
            value={plannedAmountInput}
            onChange={(event) => setPlannedAmountInput(toCurrencyInputValue(parseCurrencyInputToNumber(event.target.value)))}
            required
          />
        )}
      </div>
      {hideValueField && expenseKind === "envelope" && (
        <div style={{ marginTop: -4, fontSize: 12, color: "#6b7280" }}>
          Cada envelope criado nos meses futuros comecara com valor atual zero e sera preenchido pelos itens cadastrados no mes.
        </div>
      )}
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
      <div style={{ border: "1px solid #d1fae5", background: "#ecfdf5", borderRadius: 8, padding: 12, fontSize: 13, color: "#065f46" }}>
        {status === "active"
          ? expenseKind === "envelope" && hideValueField
            ? `Ao salvar, o envelope recorrente continuara aparecendo nos proximos meses enquanto estiver ativo, com valor atual inicial ${formatCurrencyBRL(0)}.`
            : `Ao salvar, a despesa continuará aparecendo nos próximos meses enquanto estiver ativa. Valor atual: ${formatCurrencyBRL(parseCurrencyInputToNumber(valueInput))}.`
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
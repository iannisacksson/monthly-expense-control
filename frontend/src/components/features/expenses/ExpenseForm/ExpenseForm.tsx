import { useEffect, useMemo, useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Button from "../../../ui/Button/Button";
import { parseCurrencyInputToNumber, toCurrencyInputValue } from "../../../../utils/currency";
import type { Expense, CreateExpenseDTO, Category, Subcategory } from "../../../../types";

interface ExpenseFormProps {
  userId?: string;
  monthId: string;
  categories: Category[];
  subcategories: Subcategory[];
  initialData?: Expense;
  onSubmit: (data: CreateExpenseDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
  categoryId?: string;
  hideCategoryField?: boolean;
  hidePaymentFields?: boolean;
  forcedExpenseKind?: "standard" | "envelope";
  hideExpenseKindField?: boolean;
  hideValueField?: boolean;
  submitLabel?: string;
}

export default function ExpenseForm({
  userId,
  monthId,
  categories,
  subcategories,
  initialData,
  onSubmit,
  onCancel,
  isPending,
  categoryId: categoryIdFromContext,
  hideCategoryField = false,
  hidePaymentFields = false,
  forcedExpenseKind,
  hideExpenseKindField = false,
  hideValueField = false,
  submitLabel,
}: ExpenseFormProps) {
  const resolvedCategoryId = categoryIdFromContext ?? initialData?.category_id ?? "";
  const [categoryId, setCategoryId] = useState(resolvedCategoryId);
  const [subcategoryId, setSubcategoryId] = useState(initialData?.subcategory_id ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [expenseKind, setExpenseKind] = useState<"standard" | "envelope">((forcedExpenseKind ?? initialData?.expense_kind ?? "standard") as "standard" | "envelope");
  const [valueInput, setValueInput] = useState(toCurrencyInputValue(initialData?.value));
  const [plannedAmountInput, setPlannedAmountInput] = useState(toCurrencyInputValue(initialData?.planned_amount ?? undefined));
  const [paymentDate, setPaymentDate] = useState(initialData?.payment_date?.split("T")[0] ?? new Date().toISOString().split("T")[0]);

  const filteredSubs = useMemo(
    () => subcategories.filter((subcategory) => subcategory.category_id === categoryId),
    [categoryId, subcategories]
  );

  useEffect(() => {
    if (subcategoryId && !filteredSubs.some((subcategory) => subcategory.id === subcategoryId)) {
      setSubcategoryId("");
    }
  }, [filteredSubs, subcategoryId]);

  useEffect(() => {
    setCategoryId(resolvedCategoryId);
  }, [resolvedCategoryId]);

  useEffect(() => {
    if (forcedExpenseKind) {
      setExpenseKind(forcedExpenseKind);
    }
  }, [forcedExpenseKind]);

  const numericValue = parseCurrencyInputToNumber(valueInput);
  const numericPlannedAmount = parseCurrencyInputToNumber(plannedAmountInput);
  const resolvedValue = hideValueField ? (initialData?.value ?? 0) : numericValue;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      return;
    }

    onSubmit({
      user_id: userId,
      month_id: monthId,
      category_id: categoryId,
      subcategory_id: subcategoryId || undefined,
      expense_kind: expenseKind,
      planned_amount: expenseKind === "envelope" ? numericPlannedAmount : undefined,
      description,
      value: resolvedValue,
      payment_date: shouldShowPaymentFields ? paymentDate : undefined,
    });
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const subcategoryOptions = filteredSubs.map((s) => ({ value: s.id, label: s.name }));
  const shouldShowSubcategorySelect = categoryId.length > 0;
  const hasSubcategories = filteredSubs.length > 0;
  const isEditing = Boolean(initialData);
  const showCategoryField = !hideCategoryField;
  const shouldShowPaymentFields = !hidePaymentFields && isEditing;
  const shouldShowExpenseKindField = !hideExpenseKindField && !forcedExpenseKind;
  const shouldShowPlannedAmountField = expenseKind === "envelope";
  const expenseKindOptions = [
    { value: "standard", label: "Despesa padrão" },
    { value: "envelope", label: "Envelope" },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
      {shouldShowExpenseKindField && (
        <Select
          id="expense-kind"
          label="Tipo"
          options={expenseKindOptions}
          value={expenseKind}
          onChange={(e) => setExpenseKind(e.target.value as "standard" | "envelope")}
          required
        />
      )}
      {showCategoryField && (
        <Select
          id="expense-category"
          label="Categoria"
          options={categoryOptions}
          placeholder="Selecione uma categoria"
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(""); }}
          required
        />
      )}
      {shouldShowSubcategorySelect && (
        <div>
          <Select
            id="expense-subcategory"
            label="Subcategoria"
            options={subcategoryOptions}
            placeholder={hasSubcategories ? "Selecione (opcional)" : "Nenhuma subcategoria disponível"}
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            disabled={!hasSubcategories}
          />
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>
            {hasSubcategories
              ? "Somente subcategorias da categoria selecionada são exibidas."
              : "Cadastre subcategorias nesta categoria se quiser detalhar melhor a despesa."}
          </p>
        </div>
      )}
      <Input
        id="expense-description"
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      {!hideValueField && (
        <Input
          id="expense-value"
          label={expenseKind === "envelope" ? "Valor atual (R$)" : "Valor (R$)"}
          inputMode="numeric"
          value={valueInput}
          onChange={(e) => setValueInput(toCurrencyInputValue(parseCurrencyInputToNumber(e.target.value)))}
          required
        />
      )}
      {shouldShowPlannedAmountField && (
        <Input
          id="expense-planned-amount"
          label="Valor planejado (R$)"
          inputMode="numeric"
          value={plannedAmountInput}
          onChange={(e) => setPlannedAmountInput(toCurrencyInputValue(parseCurrencyInputToNumber(e.target.value)))}
          required
        />
      )}
      {hideValueField && expenseKind === "envelope" && (
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
          O valor atual do envelope sera calculado automaticamente pela soma dos itens cadastrados.
        </p>
      )}
      {shouldShowPaymentFields && (
        <Input
          id="expense-payment-date"
          label="Data de pagamento"
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
        />
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : submitLabel ?? (initialData ? "Salvar" : "Criar")}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

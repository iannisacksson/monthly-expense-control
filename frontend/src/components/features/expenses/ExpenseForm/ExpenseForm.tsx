import { useEffect, useMemo, useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Button from "../../../ui/Button/Button";
import { parseCurrencyInputToNumber, toCurrencyInputValue } from "../../../../utils/currency";
import type { Expense, CreateExpenseDTO, Category, Subcategory } from "../../../../types";

interface ExpenseFormProps {
  familyId?: string;
  userId?: string;
  monthId: string;
  categories: Category[];
  subcategories: Subcategory[];
  memberOptions: { value: string; label: string }[];
  initialData?: Expense;
  onSubmit: (data: CreateExpenseDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
  categoryId?: string;
  hideCategoryField?: boolean;
  hidePaymentFields?: boolean;
  submitLabel?: string;
}

export default function ExpenseForm({
  familyId,
  userId,
  monthId,
  categories,
  subcategories,
  memberOptions,
  initialData,
  onSubmit,
  onCancel,
  isPending,
  categoryId: categoryIdFromContext,
  hideCategoryField = false,
  hidePaymentFields = false,
  submitLabel,
}: ExpenseFormProps) {
  const resolvedCategoryId = categoryIdFromContext ?? initialData?.category_id ?? "";
  const [categoryId, setCategoryId] = useState(resolvedCategoryId);
  const [subcategoryId, setSubcategoryId] = useState(initialData?.subcategory_id ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [valueInput, setValueInput] = useState(toCurrencyInputValue(initialData?.value));
  const [paymentDate, setPaymentDate] = useState(initialData?.payment_date?.split("T")[0] ?? new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState(initialData?.paid_by ?? "");

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

  const numericValue = parseCurrencyInputToNumber(valueInput);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      return;
    }

    onSubmit({
      user_id: userId,
      family_id: familyId,
      month_id: monthId,
      category_id: categoryId,
      subcategory_id: subcategoryId || undefined,
      description,
      value: numericValue,
      payment_date: shouldShowPaymentFields ? paymentDate : undefined,
      paid_by: hidePaymentFields ? undefined : (paidBy || undefined),
    });
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const subcategoryOptions = filteredSubs.map((s) => ({ value: s.id, label: s.name }));
  const shouldShowSubcategorySelect = categoryId.length > 0;
  const hasSubcategories = filteredSubs.length > 0;
  const isEditing = Boolean(initialData);
  const showCategoryField = !hideCategoryField;
  const shouldShowPaymentFields = !hidePaymentFields && isEditing;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
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
      <Input
        id="expense-value"
        label="Valor (R$)"
        inputMode="numeric"
        value={valueInput}
        onChange={(e) => setValueInput(toCurrencyInputValue(parseCurrencyInputToNumber(e.target.value)))}
        required
      />
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
      {shouldShowPaymentFields && memberOptions.length > 0 && (
        <Select
          id="expense-paid-by"
          label="Pago por"
          options={memberOptions}
          placeholder="Selecione (opcional)"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
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

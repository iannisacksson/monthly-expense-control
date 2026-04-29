import { useEffect, useMemo, useState, type FormEvent } from "react";
import Button from "../../../ui/Button/Button";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import { formatCurrencyBRL, parseCurrencyInputToNumber, toCurrencyInputValue } from "../../../../utils/currency";
import type { Category, CreateInstallmentGroupDTO, InstallmentGroup, Subcategory } from "../../../../types";

interface InstallmentPurchaseFormProps {
  userId?: string;
  monthId: string;
  categories: Category[];
  subcategories: Subcategory[];
  initialData?: InstallmentGroup;
  onSubmit: (data: CreateInstallmentGroupDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function InstallmentPurchaseForm({
  userId,
  monthId,
  categories,
  subcategories,
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: InstallmentPurchaseFormProps) {
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(initialData?.subcategory_id ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [totalValueInput, setTotalValueInput] = useState(toCurrencyInputValue(initialData?.total_value));
  const [installments, setInstallments] = useState(initialData?.installments?.toString() ?? "12");
  const [startingInstallmentNumber, setStartingInstallmentNumber] = useState(initialData?.starting_installment_number?.toString() ?? "1");

  const filteredSubcategories = useMemo(
    () => subcategories.filter((subcategory) => subcategory.category_id === categoryId),
    [categoryId, subcategories]
  );

  useEffect(() => {
    if (subcategoryId && !filteredSubcategories.some((subcategory) => subcategory.id === subcategoryId)) {
      setSubcategoryId("");
    }
  }, [filteredSubcategories, subcategoryId]);

  const currentInstallments = Number(installments || 0);
  const currentStartingInstallment = Number(startingInstallmentNumber || 0);
  const remainingInstallments = currentInstallments > 0 && currentStartingInstallment > 0
    ? currentInstallments - currentStartingInstallment + 1
    : 0;
  const totalValue = parseCurrencyInputToNumber(totalValueInput);
  const installmentValue = currentInstallments > 0 && totalValue > 0
    ? totalValue / currentInstallments
    : 0;

  const categoryOptions = categories.map((category) => ({ value: category.id, label: category.name }));
  const subcategoryOptions = filteredSubcategories.map((subcategory) => ({ value: subcategory.id, label: subcategory.name }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit({
      user_id: userId,
      description,
      total_value: totalValue,
      installments: Number(installments),
      starting_installment_number: Number(startingInstallmentNumber),
      category_id: categoryId,
      subcategory_id: subcategoryId || undefined,
      start_month_id: initialData?.start_month_id ?? monthId,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
      <Input
        id="installment-description"
        label="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <Input
          id="installment-total-value"
          label="Valor total (R$)"
          inputMode="numeric"
          value={totalValueInput}
          onChange={(event) => setTotalValueInput(toCurrencyInputValue(parseCurrencyInputToNumber(event.target.value)))}
          required
        />
        <Input
          id="installment-installments"
          label="Total de parcelas"
          type="number"
          min="2"
          value={installments}
          onChange={(event) => setInstallments(event.target.value)}
          required
        />
      </div>
      <Input
        id="installment-start-number"
        label="Parcela atual"
        type="number"
        min="1"
        max={currentInstallments > 0 ? String(currentInstallments) : undefined}
        value={startingInstallmentNumber}
        onChange={(event) => setStartingInstallmentNumber(event.target.value)}
        required
      />
      <div style={{ border: "1px solid #dbeafe", background: "#eff6ff", borderRadius: 8, padding: 12, fontSize: 13, color: "#1e3a8a" }}>
        {remainingInstallments > 0
          ? `Serão lançadas ${remainingInstallments} parcelas, de ${currentStartingInstallment}/${currentInstallments} até ${currentInstallments}/${currentInstallments}, com valor aproximado de ${formatCurrencyBRL(installmentValue)} por mês.`
          : "Informe o total de parcelas e a parcela atual para calcular os lançamentos restantes."}
      </div>
      <Select
        id="installment-category"
        label="Categoria"
        options={categoryOptions}
        placeholder="Selecione uma categoria"
        value={categoryId}
        onChange={(event) => { setCategoryId(event.target.value); setSubcategoryId(""); }}
        required
      />
      <Select
        id="installment-subcategory"
        label="Subcategoria"
        options={subcategoryOptions}
        placeholder={subcategoryOptions.length > 0 ? "Selecione (opcional)" : "Nenhuma subcategoria disponível"}
        value={subcategoryId}
        onChange={(event) => setSubcategoryId(event.target.value)}
        disabled={!categoryId || subcategoryOptions.length === 0}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : initialData ? "Salvar parcelamento" : "Criar parcelamento"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
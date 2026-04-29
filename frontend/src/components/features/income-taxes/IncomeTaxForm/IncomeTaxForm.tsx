import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Button from "../../../ui/Button/Button";
import { parseCurrencyInputToNumber, toCurrencyInputValue } from "../../../../utils/currency";
import type { IncomeTax, CreateIncomeTaxDTO } from "../../../../types";

const PRESET_TAX_TYPES = ["INSS", "IRRF", "DAS"];

interface IncomeTaxFormProps {
  incomeId: string;
  initialData?: IncomeTax;
  onSubmit: (data: CreateIncomeTaxDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function IncomeTaxForm({ incomeId, initialData, onSubmit, onCancel, isPending }: IncomeTaxFormProps) {
  const initialTaxType = initialData?.tax_type ?? "INSS";
  const isCustomInitialType = !PRESET_TAX_TYPES.includes(initialTaxType);

  const [taxType, setTaxType] = useState(isCustomInitialType ? "custom" : initialTaxType);
  const [customTaxType, setCustomTaxType] = useState(isCustomInitialType ? initialTaxType : "");
  const [valueInput, setValueInput] = useState(toCurrencyInputValue(initialData?.value));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const resolvedTaxType = taxType === "custom" ? customTaxType.trim() : taxType;

    onSubmit({ monthly_income_id: incomeId, tax_type: resolvedTaxType, value: parseCurrencyInputToNumber(valueInput), is_auto: false });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Select
        id="income-tax-type"
        label="Tipo de imposto"
        options={[
          { value: "INSS", label: "INSS" },
          { value: "IRRF", label: "IRRF" },
          { value: "DAS", label: "DAS" },
          { value: "custom", label: "Customizado" },
        ]}
        value={taxType}
        onChange={(e) => setTaxType(e.target.value)}
      />
      {taxType === "custom" && (
        <Input
          id="income-tax-custom-type"
          label="Nome do imposto"
          type="text"
          maxLength={100}
          value={customTaxType}
          onChange={(e) => setCustomTaxType(e.target.value)}
          placeholder="Ex.: Simples Nacional"
          required
        />
      )}
      <Input
        id="income-tax-value"
        label="Valor"
        inputMode="numeric"
        value={valueInput}
        onChange={(e) => setValueInput(toCurrencyInputValue(parseCurrencyInputToNumber(e.target.value)))}
        required
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : initialData ? "Salvar" : "Criar"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>Cancelar</Button>
      </div>
    </form>
  );
}
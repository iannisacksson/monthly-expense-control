import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Button from "../../../ui/Button/Button";
import { parseCurrencyInputToNumber, toCurrencyInputValue } from "../../../../utils/currency";
import type { MonthlyIncome, CreateMonthlyIncomeDTO } from "../../../../types";

interface IncomeFormProps {
  monthId: string;
  defaultUserId?: string;
  initialData?: MonthlyIncome;
  onSubmit: (data: CreateMonthlyIncomeDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function IncomeForm({ monthId, defaultUserId, initialData, onSubmit, onCancel, isPending }: IncomeFormProps) {
  const initialTaxationMode = initialData?.taxation_mode ?? "manual";
  const initialTaxationProfile = initialData?.taxation_profile ?? "me_pro_labore";
  const initialTaxationParameters = initialData?.taxation_parameters;
  const [grossIncomeInput, setGrossIncomeInput] = useState(toCurrencyInputValue(initialData?.gross_income));
  const [incomeType, setIncomeType] = useState(initialData?.income_type ?? "CLT");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [taxationMode, setTaxationMode] = useState<"manual" | "automatic">(initialTaxationMode);
  const [taxationProfile, setTaxationProfile] = useState<"me_pro_labore">(initialTaxationProfile);
  const [accountantFeeInput, setAccountantFeeInput] = useState(toCurrencyInputValue(initialTaxationParameters?.accountant_fee));
  const [irrfMode, setIrrfMode] = useState<"disabled" | "manual_amount">(initialTaxationParameters?.irrf_mode ?? "disabled");
  const [irrfManualAmountInput, setIrrfManualAmountInput] = useState(toCurrencyInputValue(initialTaxationParameters?.irrf_manual_amount));
  const resolvedUserId = initialData?.user_id ?? defaultUserId ?? "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const taxation = taxationMode === "automatic"
      ? {
          mode: "automatic" as const,
          profile: taxationProfile,
          parameters: {
            accountant_fee: parseCurrencyInputToNumber(accountantFeeInput),
            irrf_mode: irrfMode,
            irrf_manual_amount: irrfMode === "manual_amount"
              ? parseCurrencyInputToNumber(irrfManualAmountInput)
              : undefined,
          },
        }
      : {
          mode: "manual" as const,
        };

    onSubmit({
      user_id: resolvedUserId,
      month_id: monthId,
      gross_income: parseCurrencyInputToNumber(grossIncomeInput),
      income_type: incomeType,
      notes: notes || undefined,
      taxation,
    });
  };

  const typeOptions = [
    { value: "CLT", label: "CLT" },
    { value: "freelance", label: "Freelance" },
    { value: "business", label: "Empresa" },
    { value: "other", label: "Outro" },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <Input
        id="income-gross"
        label="Renda Bruta (R$)"
        inputMode="numeric"
        value={grossIncomeInput}
        onChange={(e) => setGrossIncomeInput(toCurrencyInputValue(parseCurrencyInputToNumber(e.target.value)))}
        required
      />
      <Select
        id="income-type"
        label="Tipo"
        options={typeOptions}
        value={incomeType}
        onChange={(e) => setIncomeType(e.target.value)}
      />
      <Select
        id="income-taxation-mode"
        label="Tributação"
        options={[{ value: "manual", label: "Manual" }, { value: "automatic", label: "Automática" }]}
        value={taxationMode}
        onChange={(e) => setTaxationMode(e.target.value as "manual" | "automatic")}
      />
      {taxationMode === "automatic" && (
        <>
          <Select
            id="income-taxation-profile"
            label="Perfil tributário"
            options={[{ value: "me_pro_labore", label: "ME com pró-labore" }]}
            value={taxationProfile}
            onChange={(e) => setTaxationProfile(e.target.value as "me_pro_labore")}
          />
          <Input
            id="income-accountant-fee"
            label="Honorário do contador (R$)"
            inputMode="numeric"
            value={accountantFeeInput}
            onChange={(e) => setAccountantFeeInput(toCurrencyInputValue(parseCurrencyInputToNumber(e.target.value)))}
            required={taxationMode === "automatic"}
          />
          <Select
            id="income-irrf-mode"
            label="IRRF"
            options={[{ value: "disabled", label: "Não calcular agora" }, { value: "manual_amount", label: "Informar valor manual" }]}
            value={irrfMode}
            onChange={(e) => setIrrfMode(e.target.value as "disabled" | "manual_amount")}
          />
          {irrfMode === "manual_amount" && (
            <Input
              id="income-irrf-manual-amount"
              label="Valor manual de IRRF (R$)"
              inputMode="numeric"
              value={irrfManualAmountInput}
              onChange={(e) => setIrrfManualAmountInput(toCurrencyInputValue(parseCurrencyInputToNumber(e.target.value)))}
              required
            />
          )}
        </>
      )}
      <Input
        id="income-notes"
        label="Observações"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : initialData ? "Salvar" : "Criar"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

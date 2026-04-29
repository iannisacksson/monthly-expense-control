import { useState, type FormEvent } from "react";
import Button from "../../../ui/Button/Button";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import { parseCurrencyInputToNumber, toCurrencyInputValue } from "../../../../utils/currency";
import type { CreateRecurringIncomeDTO, RecurringIncome } from "../../../../types";

interface RecurringIncomeFormProps {
  defaultUserId?: string;
  monthId: string;
  initialData?: RecurringIncome;
  onSubmit: (data: CreateRecurringIncomeDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

const incomeTypeOptions = [
  { value: "salary", label: "Salário" },
  { value: "freelance", label: "Freelance" },
  { value: "overtime", label: "Hora extra" },
  { value: "profit_sharing", label: "Participação nos lucros" },
  { value: "other", label: "Outro" },
];

const kindOptions = [
  { value: "fixed_salary", label: "Salário fixo" },
  { value: "recurring_extra", label: "Renda extra recorrente" },
];

const statusOptions = [
  { value: "active", label: "Ativa" },
  { value: "inactive", label: "Inativa" },
];

export default function RecurringIncomeForm({
  defaultUserId,
  monthId,
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: RecurringIncomeFormProps) {
  const resolvedUserId = initialData?.user_id ?? defaultUserId;
  const initialTaxationMode = initialData?.taxation_mode ?? "manual";
  const initialTaxationProfile = initialData?.taxation_profile ?? "me_pro_labore";
  const initialTaxationParameters = initialData?.taxation_parameters;
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [grossIncomeInput, setGrossIncomeInput] = useState(toCurrencyInputValue(initialData?.gross_income));
  const [incomeType, setIncomeType] = useState(initialData?.income_type ?? "salary");
  const [kind, setKind] = useState(initialData?.kind ?? "fixed_salary");
  const [status, setStatus] = useState(initialData?.status ?? "active");
  const [taxationMode, setTaxationMode] = useState<"manual" | "automatic">(initialTaxationMode);
  const [taxationProfile, setTaxationProfile] = useState<"me_pro_labore">(initialTaxationProfile);
  const [accountantFeeInput, setAccountantFeeInput] = useState(toCurrencyInputValue(initialTaxationParameters?.accountant_fee));
  const [irrfMode, setIrrfMode] = useState<"disabled" | "manual_amount">(initialTaxationParameters?.irrf_mode ?? "disabled");
  const [irrfManualAmountInput, setIrrfManualAmountInput] = useState(toCurrencyInputValue(initialTaxationParameters?.irrf_manual_amount));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!resolvedUserId) {
      return;
    }

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
      description,
      gross_income: parseCurrencyInputToNumber(grossIncomeInput),
      income_type: incomeType,
      kind,
      start_month_id: initialData?.start_month_id ?? monthId,
      status,
      taxation,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
      {!resolvedUserId && (
        <div className="error-banner">
          Não foi possível identificar o usuário dono do mês para criar a recorrência.
        </div>
      )}
      <div className="alert-banner">
        Esta recorrência ficará associada automaticamente ao usuário dono do mês selecionado.
      </div>
      <Input
        id="recurring-income-description"
        label="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <Input
          id="recurring-income-gross"
          label="Valor bruto (R$)"
          inputMode="numeric"
          value={grossIncomeInput}
          onChange={(event) => setGrossIncomeInput(toCurrencyInputValue(parseCurrencyInputToNumber(event.target.value)))}
          required
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <Select
          id="recurring-income-kind"
          label="Tipo de recorrência"
          options={kindOptions}
          value={kind}
          onChange={(event) => setKind(event.target.value)}
          required
        />
        <Select
          id="recurring-income-type"
          label="Natureza da renda"
          options={incomeTypeOptions}
          value={incomeType}
          onChange={(event) => setIncomeType(event.target.value)}
          required
        />
      </div>
      <Select
        id="recurring-income-taxation-mode"
        label="Tributação"
        options={[{ value: "manual", label: "Manual" }, { value: "automatic", label: "Automática" }]}
        value={taxationMode}
        onChange={(event) => setTaxationMode(event.target.value as "manual" | "automatic")}
      />
      {taxationMode === "automatic" && (
        <>
          <Select
            id="recurring-income-taxation-profile"
            label="Perfil tributário"
            options={[{ value: "me_pro_labore", label: "ME com pró-labore" }]}
            value={taxationProfile}
            onChange={(event) => setTaxationProfile(event.target.value as "me_pro_labore")}
          />
          <Input
            id="recurring-income-accountant-fee"
            label="Honorário do contador (R$)"
            inputMode="numeric"
            value={accountantFeeInput}
            onChange={(event) => setAccountantFeeInput(toCurrencyInputValue(parseCurrencyInputToNumber(event.target.value)))}
            required={taxationMode === "automatic"}
          />
          <Select
            id="recurring-income-irrf-mode"
            label="IRRF"
            options={[{ value: "disabled", label: "Não calcular agora" }, { value: "manual_amount", label: "Informar valor manual" }]}
            value={irrfMode}
            onChange={(event) => setIrrfMode(event.target.value as "disabled" | "manual_amount")}
          />
          {irrfMode === "manual_amount" && (
            <Input
              id="recurring-income-irrf-manual-amount"
              label="Valor manual de IRRF (R$)"
              inputMode="numeric"
              value={irrfManualAmountInput}
              onChange={(event) => setIrrfManualAmountInput(toCurrencyInputValue(parseCurrencyInputToNumber(event.target.value)))}
              required
            />
          )}
        </>
      )}
      <Select
        id="recurring-income-status"
        label="Status"
        options={statusOptions}
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        required
      />
      <div style={{ border: "1px solid #d1fae5", background: "#ecfdf5", borderRadius: 8, padding: 12, fontSize: 13, color: "#065f46" }}>
        {status === "active"
          ? "Ao salvar, a receita continuará aparecendo em todos os meses a partir deste, até que a recorrência seja inativada."
          : "A definição ficará salva, mas não lançará receitas enquanto estiver inativa."}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending || !resolvedUserId}>
          {isPending ? "Salvando..." : initialData ? "Salvar recorrência" : "Criar recorrência"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

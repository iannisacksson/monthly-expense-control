import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Button from "../../../ui/Button/Button";
import type { Month, CreateMonthDTO } from "../../../../types";

interface MonthFormProps {
  familyId?: string;
  userId?: string;
  initialData?: Month;
  onSubmit: (data: CreateMonthDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function MonthForm({ familyId, userId, initialData, onSubmit, onCancel, isPending }: MonthFormProps) {
  const now = new Date();
  const [year, setYear] = useState(initialData?.year?.toString() ?? now.getFullYear().toString());
  const [month, setMonth] = useState(initialData?.month?.toString() ?? (now.getMonth() + 1).toString());
  const [status, setStatus] = useState(initialData?.status ?? "open");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ user_id: userId, family_id: familyId, year: Number(year), month: Number(month), status });
  };

  const monthOptions = MONTH_NAMES.map((name, i) => ({ value: String(i + 1), label: name }));
  const statusOptions = [
    { value: "open", label: "Aberto" },
    { value: "closed", label: "Fechado" },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <Input
        id="month-year"
        label="Ano"
        type="number"
        min="2020"
        max="2100"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <Select
        id="month-month"
        label="Mês"
        options={monthOptions}
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <Select
        id="month-status"
        label="Status"
        options={statusOptions}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
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

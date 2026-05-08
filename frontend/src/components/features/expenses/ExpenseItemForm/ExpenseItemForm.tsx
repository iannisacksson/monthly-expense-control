import { useState } from "react";
import Button from "../../../ui/Button/Button";
import Input from "../../../ui/Input/Input";
import { parseCurrencyInputToNumber, toCurrencyInputValue } from "../../../../utils/currency";
import type { CreateExpenseItemDTO, ExpenseItem } from "../../../../types";

interface ExpenseItemFormProps {
  initialData?: ExpenseItem;
  onSubmit: (data: CreateExpenseItemDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function ExpenseItemForm({ initialData, onSubmit, onCancel, isPending }: ExpenseItemFormProps) {
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [amountInput, setAmountInput] = useState(toCurrencyInputValue(initialData?.amount));

  return (
    <form
      className="form-shell"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          description,
          amount: parseCurrencyInputToNumber(amountInput),
        });
      }}
    >
      <Input
        id="expense-item-description"
        label="Nome do item"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      />

      <Input
        id="expense-item-amount"
        label="Valor (R$)"
        inputMode="numeric"
        value={amountInput}
        onChange={(event) => setAmountInput(toCurrencyInputValue(parseCurrencyInputToNumber(event.target.value)))}
        required
      />

      <div className="action-row">
        <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : initialData ? "Salvar item" : "Adicionar item"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>Cancelar</Button>
      </div>
    </form>
  );
}
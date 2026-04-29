import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import type { Family, CreateFamilyDTO } from "../../../../types";

interface FamilyFormProps {
  initialData?: Family;
  onSubmit: (data: CreateFamilyDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function FamilyForm({ initialData, onSubmit, onCancel, isPending }: FamilyFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <Input
        id="family-name"
        label="Nome da Família"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
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

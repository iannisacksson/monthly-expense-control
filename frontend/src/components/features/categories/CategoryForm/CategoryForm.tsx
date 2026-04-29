import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Button from "../../../ui/Button/Button";
import type { Category, CreateCategoryDTO } from "../../../../types";

interface CategoryFormProps {
  familyId?: string;
  userId?: string;
  initialData?: Category;
  onSubmit: (data: CreateCategoryDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function CategoryForm({ familyId, userId, initialData, onSubmit, onCancel, isPending }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [type, setType] = useState(initialData?.type ?? "essential");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ family_id: familyId, user_id: userId, name, type });
  };

  const typeOptions = [
    { value: "essential", label: "Essencial" },
    { value: "necessary", label: "Necessário" },
    { value: "lifestyle", label: "Estilo de Vida" },
    { value: "investment", label: "Investimento" },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <Input
        id="category-name"
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Select
        id="category-type"
        label="Tipo"
        options={typeOptions}
        value={type}
        onChange={(e) => setType(e.target.value)}
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

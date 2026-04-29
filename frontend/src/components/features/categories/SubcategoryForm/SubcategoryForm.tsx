import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import type { Subcategory, CreateSubcategoryDTO } from "../../../../types";

interface SubcategoryFormProps {
  categoryId: string;
  initialData?: Subcategory;
  onSubmit: (data: CreateSubcategoryDTO) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function SubcategoryForm({ categoryId, initialData, onSubmit, onCancel, isPending }: SubcategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ category_id: categoryId, name });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <Input
        id="subcategory-name"
        label="Nome"
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

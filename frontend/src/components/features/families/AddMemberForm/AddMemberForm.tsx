import { useState, type FormEvent } from "react";
import Input from "../../../ui/Input/Input";
import Select from "../../../ui/Select/Select";
import Button from "../../../ui/Button/Button";

interface AddMemberFormProps {
  familyId: string;
  onSubmit: (data: { family_id: string; user_id: string; role: string }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function AddMemberForm({ familyId, onSubmit, onCancel, isPending }: AddMemberFormProps) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("member");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ family_id: familyId, user_id: userId, role });
  };

  const roleOptions = [
    { value: "admin", label: "Administrador" },
    { value: "member", label: "Membro" },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <Input
        id="member-user-id"
        label="ID do Usuário"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />
      <Select
        id="member-role"
        label="Papel"
        options={roleOptions}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adicionando..." : "Adicionar"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFamilyMembers, useAddFamilyMember, useRemoveFamilyMember, useFamily } from "../hooks";
import MemberList from "../components/features/families/MemberList/MemberList";
import AddMemberForm from "../components/features/families/AddMemberForm/AddMemberForm";
import Button from "../components/ui/Button/Button";
import type { CreateFamilyMemberDTO } from "../types";

export default function FamilyMembersPage() {
  const { familyId } = useParams<{ familyId: string }>();
  const { data: family } = useFamily(familyId!);
  const { data: members, isLoading, error } = useFamilyMembers(familyId!);
  const addMember = useAddFamilyMember();
  const removeMember = useRemoveFamilyMember();

  const [showForm, setShowForm] = useState(false);

  const mutationError = addMember.error ?? removeMember.error;

  const handleAdd = (data: CreateFamilyMemberDTO) => {
    addMember.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleRemove = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este membro?")) {
      removeMember.mutate(id);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar membros.</p>;

  return (
    <div>
      <Link to="/families" style={{ color: "#2563eb", marginBottom: 16, display: "inline-block" }}>
        ← Voltar para famílias
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Membros — {family?.name ?? "Família"}</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Adicionar Membro</Button>
        )}
      </div>

      {mutationError && (
        <p style={{ color: "#ef4444", marginBottom: 16 }}>
          Erro: {mutationError.message || "Falha na operação. Tente novamente."}
        </p>
      )}

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <h2>Novo Membro</h2>
          <AddMemberForm
            familyId={familyId!}
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isPending={addMember.isPending}
          />
        </div>
      )}

      <MemberList members={members ?? []} onRemove={handleRemove} />
    </div>
  );
}

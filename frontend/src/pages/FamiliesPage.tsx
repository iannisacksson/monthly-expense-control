import { useState } from "react";
import { useFamilies, useCreateFamily, useUpdateFamily, useDeleteFamily } from "../hooks";
import { useNavigate } from "react-router-dom";
import FamilyList from "../components/features/families/FamilyList/FamilyList";
import FamilyForm from "../components/features/families/FamilyForm/FamilyForm";
import Button from "../components/ui/Button/Button";
import type { Family, CreateFamilyDTO } from "../types";

export default function FamiliesPage() {
  const { data: families, isLoading, error } = useFamilies();
  const createFamily = useCreateFamily();
  const updateFamily = useUpdateFamily();
  const deleteFamily = useDeleteFamily();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | undefined>();

  const mutationError = createFamily.error ?? updateFamily.error ?? deleteFamily.error;

  const handleCreate = (data: CreateFamilyDTO) => {
    createFamily.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (data: CreateFamilyDTO) => {
    if (!editingFamily) return;
    updateFamily.mutate(
      { id: editingFamily.id, dto: { name: data.name } },
      { onSuccess: () => setEditingFamily(undefined) }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta família?")) {
      deleteFamily.mutate(id);
    }
  };

  const handleEdit = (family: Family) => {
    setEditingFamily(family);
    setShowForm(false);
  };

  const handleSelect = (family: Family) => {
    navigate(`/families/${family.id}/months`);
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar famílias.</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Famílias</h1>
        {!showForm && !editingFamily && (
          <Button onClick={() => setShowForm(true)}>Nova Família</Button>
        )}
      </div>

      {mutationError && (
        <p style={{ color: "#ef4444", marginBottom: 16 }}>
          Erro: {mutationError.message || "Falha ao salvar. Tente novamente."}
        </p>
      )}

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <h2>Nova Família</h2>
          <FamilyForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isPending={createFamily.isPending}
          />
        </div>
      )}

      {editingFamily && (
        <div style={{ marginBottom: 24 }}>
          <h2>Editar Família</h2>
          <FamilyForm
            initialData={editingFamily}
            onSubmit={handleUpdate}
            onCancel={() => setEditingFamily(undefined)}
            isPending={updateFamily.isPending}
          />
        </div>
      )}

      <FamilyList
        families={families ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
      />
    </div>
  );
}

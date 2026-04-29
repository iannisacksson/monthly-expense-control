import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSubcategories, useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory, useCategory } from "../hooks";
import SubcategoryList from "../components/features/categories/SubcategoryList/SubcategoryList";
import SubcategoryForm from "../components/features/categories/SubcategoryForm/SubcategoryForm";
import Button from "../components/ui/Button/Button";
import type { Subcategory, CreateSubcategoryDTO, UpdateSubcategoryDTO } from "../types";

export default function SubcategoriesPage() {
  const { userId, categoryId } = useParams<{ userId?: string; categoryId: string }>();
  const { data: category } = useCategory(categoryId!);
  const { data: subcategories, isLoading, error } = useSubcategories(categoryId!);
  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();

  const [showForm, setShowForm] = useState(false);
  const [editingSub, setEditingSub] = useState<Subcategory | undefined>();

  const mutationError = createSubcategory.error ?? updateSubcategory.error ?? deleteSubcategory.error;

  const handleCreate = (data: CreateSubcategoryDTO) => {
    createSubcategory.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (data: CreateSubcategoryDTO) => {
    if (!editingSub) return;
    const dto: UpdateSubcategoryDTO = { name: data.name };
    updateSubcategory.mutate(
      { id: editingSub.id, dto },
      { onSuccess: () => setEditingSub(undefined) }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta subcategoria?")) {
      deleteSubcategory.mutate(id);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar subcategorias.</p>;

  const backLink = userId ? `/users/${userId}/categories` : "/";

  return (
    <div>
      <Link to={backLink} style={{ color: "#2563eb", marginBottom: 16, display: "inline-block" }}>
        ← Voltar para categorias
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Subcategorias — {category?.name ?? "Categoria"}</h1>
        {!showForm && !editingSub && (
          <Button onClick={() => setShowForm(true)}>Nova Subcategoria</Button>
        )}
      </div>

      {mutationError && (
        <p style={{ color: "#ef4444", marginBottom: 16 }}>
          Erro: {mutationError.message || "Falha ao salvar. Tente novamente."}
        </p>
      )}

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <h2>Nova Subcategoria</h2>
          <SubcategoryForm
            categoryId={categoryId!}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isPending={createSubcategory.isPending}
          />
        </div>
      )}

      {editingSub && (
        <div style={{ marginBottom: 24 }}>
          <h2>Editar Subcategoria</h2>
          <SubcategoryForm
            categoryId={categoryId!}
            initialData={editingSub}
            onSubmit={handleUpdate}
            onCancel={() => setEditingSub(undefined)}
            isPending={updateSubcategory.isPending}
          />
        </div>
      )}

      <SubcategoryList
        subcategories={subcategories ?? []}
        onEdit={(s) => { setEditingSub(s); setShowForm(false); }}
        onDelete={handleDelete}
      />
    </div>
  );
}

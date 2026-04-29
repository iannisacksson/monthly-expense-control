import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useUser } from "../hooks";
import CategoryList from "../components/features/categories/CategoryList/CategoryList";
import CategoryForm from "../components/features/categories/CategoryForm/CategoryForm";
import Button from "../components/ui/Button/Button";
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from "../types";

export default function CategoriesPage() {
  const { userId } = useParams<{ userId?: string }>();
  const { data: user } = useUser(userId ?? "");
  const { data: categories, isLoading, error } = useCategories({ userId });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const mutationError = createCategory.error ?? updateCategory.error ?? deleteCategory.error;

  const handleCreate = (data: CreateCategoryDTO) => {
    createCategory.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (data: CreateCategoryDTO) => {
    if (!editingCategory) return;
    const dto: UpdateCategoryDTO = { name: data.name, type: data.type };
    updateCategory.mutate(
      { id: editingCategory.id, dto },
      { onSuccess: () => setEditingCategory(undefined) }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(false);
  };

  const handleSelect = (category: Category) => {
    navigate(`/users/${userId}/categories/${category.id}/subcategories`);
  };

  const backLink = userId ? `/users/${userId}/months` : "/";
  const ownerLabel = user?.name ?? "Usuário";

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar categorias.</p>;

  return (
    <div>
      <Link to={backLink} style={{ color: "#2563eb", marginBottom: 16, display: "inline-block" }}>
        ← Voltar
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Categorias — {ownerLabel}</h1>
        {!showForm && !editingCategory && (
          <Button onClick={() => setShowForm(true)}>Nova Categoria</Button>
        )}
      </div>

      {mutationError && (
        <p style={{ color: "#ef4444", marginBottom: 16 }}>
          Erro: {mutationError.message || "Falha ao salvar. Tente novamente."}
        </p>
      )}

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <h2>Nova Categoria</h2>
          <CategoryForm
            userId={userId}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isPending={createCategory.isPending}
          />
        </div>
      )}

      {editingCategory && (
        <div style={{ marginBottom: 24 }}>
          <h2>Editar Categoria</h2>
          <CategoryForm
            userId={userId}
            initialData={editingCategory}
            onSubmit={handleUpdate}
            onCancel={() => setEditingCategory(undefined)}
            isPending={updateCategory.isPending}
          />
        </div>
      )}

      <CategoryList
        categories={categories ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
      />
    </div>
  );
}

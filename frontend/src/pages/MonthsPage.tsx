import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMonths, useCreateMonth, useUpdateMonth, useFinalizeMonth, useUser } from "../hooks";
import MonthList from "../components/features/months/MonthList/MonthList";
import MonthForm from "../components/features/months/MonthForm/MonthForm";
import Button from "../components/ui/Button/Button";
import type { Month, CreateMonthDTO, UpdateMonthDTO } from "../types";

export default function MonthsPage() {
  const [statusFilter, setStatusFilter] = useState<"open" | "closed" | "all">("open");
  const { userId } = useParams<{ userId?: string }>();
  const { data: user } = useUser(userId ?? "");
  const { data: months, isLoading, error } = useMonths({ userId });
  const createMonth = useCreateMonth();
  const updateMonth = useUpdateMonth();
  const finalizeMonth = useFinalizeMonth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingMonth, setEditingMonth] = useState<Month | undefined>();

  const filteredMonths = (months ?? []).filter((month) => (
    statusFilter === "all" ? true : month.status === statusFilter
  ));

  const mutationError = createMonth.error ?? updateMonth.error ?? finalizeMonth.error;

  const handleCreate = (data: CreateMonthDTO) => {
    createMonth.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (data: CreateMonthDTO) => {
    if (!editingMonth) return;
    const dto: UpdateMonthDTO = { status: data.status };
    updateMonth.mutate(
      { id: editingMonth.id, dto },
      { onSuccess: () => setEditingMonth(undefined) }
    );
  };

  const handleFinalize = (month: Month) => {
    if (month.status === "closed") {
      return;
    }

    if (window.confirm(`Finalizar ${month.month}/${month.year}? Depois disso, ações incompatíveis serão bloqueadas.`)) {
      finalizeMonth.mutate(month.id);
    }
  };

  const handleEdit = (month: Month) => {
    setEditingMonth(month);
    setShowForm(false);
  };

  const handleSelect = (month: Month) => {
    navigate(`/users/${userId}/months/${month.id}`);
  };

  const backLink = "/";
  const pageTitle = user?.name ?? "Usuário";
  const categoriesLink = userId ? `/users/${userId}/categories` : undefined;

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar meses.</p>;

  return (
    <div className="page">
      <Link to={backLink} className="page-back-link">
        ← Voltar
      </Link>

      <section className="page-hero">
        <div className="page-hero__content">
          <div className="page-hero__eyebrow">Planejamento mensal</div>
          <h1 className="page-title">Meses de {pageTitle}</h1>
          <p className="page-subtitle">Crie, acompanhe e finalize ciclos mensais com foco em leitura rápida e decisões do período.</p>
        </div>
        <div className="page-hero__actions">
          <div className="status-pill">Ciclos e fechamento</div>
          {categoriesLink && (
            <Button variant="secondary" onClick={() => navigate(categoriesLink)}>
              Categorias
            </Button>
          )}
          {!showForm && !editingMonth && (
            <Button onClick={() => setShowForm(true)}>Novo Mês</Button>
          )}
        </div>
      </section>

      {mutationError && (
        <p className="error-banner">
          Erro: {mutationError.message || "Falha ao salvar. Tente novamente."}
        </p>
      )}

      {showForm && (
        <div className="form-shell">
          <div>
            <div className="section-label">Criação</div>
            <h2 className="page-section__title">Novo mês</h2>
          </div>
          <MonthForm
            userId={userId}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isPending={createMonth.isPending}
          />
        </div>
      )}

      {editingMonth && (
        <div className="form-shell">
          <div>
            <div className="section-label">Edição</div>
            <h2 className="page-section__title">Editar mês</h2>
          </div>
          <MonthForm
            userId={userId}
            initialData={editingMonth}
            onSubmit={handleUpdate}
            onCancel={() => setEditingMonth(undefined)}
            isPending={updateMonth.isPending}
          />
        </div>
      )}

      <div className="month-list-shell">
        <div className="page-section__header">
          <div>
            <div className="section-label">Linha do tempo</div>
            <h2 className="page-section__title">Meses cadastrados</h2>
            <p className="page-section__subtitle">Selecione um mês para abrir o painel detalhado do período.</p>
          </div>
          <label className="ui-field inline-select">
            Status
            <select
              className="ui-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "open" | "closed" | "all")}
            >
              <option value="open">Abertos</option>
              <option value="closed">Fechados</option>
              <option value="all">Todos</option>
            </select>
          </label>
        </div>
        <div className="section-toolbar">
          <p className="muted-text">
            {statusFilter === "open" && "Exibindo apenas meses em aberto."}
            {statusFilter === "closed" && "Exibindo apenas meses fechados."}
            {statusFilter === "all" && "Exibindo todos os meses cadastrados."}
          </p>
        </div>
        <MonthList
          months={filteredMonths}
          onEdit={handleEdit}
          onFinalize={handleFinalize}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}

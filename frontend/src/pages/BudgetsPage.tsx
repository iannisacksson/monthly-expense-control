import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useBudgetRules,
  useCreateBudgetRule,
  useUpdateBudgetRule,
  useDeleteBudgetRule,
  useBudgetAllocations,
  useCreateBudgetAllocation,
  useUpdateBudgetAllocation,
  useDeleteBudgetAllocation,
  useCategories,
  useFamily,
} from "../hooks";
import BudgetRuleForm from "../components/features/budgets/BudgetRuleForm/BudgetRuleForm";
import BudgetRuleList from "../components/features/budgets/BudgetRuleList/BudgetRuleList";
import BudgetAllocationForm from "../components/features/budgets/BudgetAllocationForm/BudgetAllocationForm";
import BudgetAllocationList from "../components/features/budgets/BudgetAllocationList/BudgetAllocationList";
import Button from "../components/ui/Button/Button";
import type {
  BudgetRule,
  CreateBudgetRuleDTO,
  UpdateBudgetRuleDTO,
  BudgetAllocation,
  CreateBudgetAllocationDTO,
  UpdateBudgetAllocationDTO,
} from "../types";

export default function BudgetsPage() {
  const { familyId } = useParams<{ familyId: string }>();
  const { data: family } = useFamily(familyId!);
  const { data: categories } = useCategories({ familyId: familyId! });
  const { data: rules, isLoading, error } = useBudgetRules({ familyId: familyId! });

  const [selectedRule, setSelectedRule] = useState<BudgetRule | undefined>();
  const { data: allocations } = useBudgetAllocations(selectedRule?.id ?? "");

  const createRule = useCreateBudgetRule();
  const updateRule = useUpdateBudgetRule();
  const deleteRule = useDeleteBudgetRule();
  const createAllocation = useCreateBudgetAllocation();
  const updateAllocation = useUpdateBudgetAllocation();
  const deleteAllocation = useDeleteBudgetAllocation();

  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<BudgetRule | undefined>();
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<BudgetAllocation | undefined>();

  useEffect(() => {
    if (!selectedRule && rules && rules.length > 0) {
      setSelectedRule(rules[0]);
    }
  }, [rules, selectedRule]);

  const mutationError = createRule.error ?? updateRule.error ?? deleteRule.error ?? createAllocation.error ?? updateAllocation.error ?? deleteAllocation.error;

  const handleCreateRule = (data: CreateBudgetRuleDTO) => {
    createRule.mutate(data, { onSuccess: (rule) => { setShowRuleForm(false); setSelectedRule(rule); } });
  };

  const handleUpdateRule = (data: CreateBudgetRuleDTO) => {
    if (!editingRule) return;
    const dto: UpdateBudgetRuleDTO = { name: data.name };
    updateRule.mutate({ id: editingRule.id, dto }, { onSuccess: (rule) => { setEditingRule(undefined); setSelectedRule(rule); } });
  };

  const handleDeleteRule = (id: string) => {
    if (!window.confirm("Excluir esta regra de orçamento?")) return;
    deleteRule.mutate(id, {
      onSuccess: () => {
        if (selectedRule?.id === id) setSelectedRule(undefined);
      },
    });
  };

  const handleCreateAllocation = (data: CreateBudgetAllocationDTO) => {
    createAllocation.mutate(data, { onSuccess: () => setShowAllocationForm(false) });
  };

  const handleUpdateAllocation = (data: CreateBudgetAllocationDTO) => {
    if (!editingAllocation) return;
    const dto: UpdateBudgetAllocationDTO = { category_id: data.category_id, percentage: data.percentage };
    updateAllocation.mutate({ id: editingAllocation.id, dto }, { onSuccess: () => setEditingAllocation(undefined) });
  };

  const handleDeleteAllocation = (id: string) => {
    if (window.confirm("Excluir esta alocação?")) {
      deleteAllocation.mutate(id);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar regras de orçamento.</p>;

  return (
    <div>
      <Link to={`/families/${familyId}/months`} style={{ color: "#2563eb", marginBottom: 16, display: "inline-block" }}>
        ← Voltar para meses
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Orçamento — {family?.name ?? "Família"}</h1>
        {!showRuleForm && !editingRule && <Button onClick={() => setShowRuleForm(true)}>Nova Regra</Button>}
      </div>

      {mutationError && <p style={{ color: "#ef4444", marginBottom: 16 }}>Erro: {mutationError.message || "Falha ao salvar."}</p>}

      {showRuleForm && (
        <div style={{ marginBottom: 24 }}>
          <h2>Nova Regra</h2>
          <BudgetRuleForm familyId={familyId!} onSubmit={handleCreateRule} onCancel={() => setShowRuleForm(false)} isPending={createRule.isPending} />
        </div>
      )}

      {editingRule && (
        <div style={{ marginBottom: 24 }}>
          <h2>Editar Regra</h2>
          <BudgetRuleForm familyId={familyId!} initialData={editingRule} onSubmit={handleUpdateRule} onCancel={() => setEditingRule(undefined)} isPending={updateRule.isPending} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 360px) 1fr", gap: 24, alignItems: "start" }}>
        <div>
          <BudgetRuleList
            rules={rules ?? []}
            selectedRuleId={selectedRule?.id}
            onSelect={setSelectedRule}
            onEdit={(rule) => { setEditingRule(rule); setShowRuleForm(false); }}
            onDelete={handleDeleteRule}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Alocações {selectedRule ? `— ${selectedRule.name}` : ""}</h2>
            {selectedRule && !showAllocationForm && !editingAllocation && (
              <Button onClick={() => setShowAllocationForm(true)}>Nova Alocação</Button>
            )}
          </div>

          {!selectedRule && <p>Selecione uma regra para gerenciar as alocações.</p>}

          {selectedRule && showAllocationForm && (
            <div style={{ marginBottom: 24 }}>
              <BudgetAllocationForm
                ruleId={selectedRule.id}
                categories={categories ?? []}
                onSubmit={handleCreateAllocation}
                onCancel={() => setShowAllocationForm(false)}
                isPending={createAllocation.isPending}
              />
            </div>
          )}

          {selectedRule && editingAllocation && (
            <div style={{ marginBottom: 24 }}>
              <BudgetAllocationForm
                ruleId={selectedRule.id}
                categories={categories ?? []}
                initialData={editingAllocation}
                onSubmit={handleUpdateAllocation}
                onCancel={() => setEditingAllocation(undefined)}
                isPending={updateAllocation.isPending}
              />
            </div>
          )}

          {selectedRule && (
            <BudgetAllocationList
              allocations={allocations ?? []}
              categories={categories ?? []}
              onEdit={(allocation) => { setEditingAllocation(allocation); setShowAllocationForm(false); }}
              onDelete={handleDeleteAllocation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
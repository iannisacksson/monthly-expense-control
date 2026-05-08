import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useBudgetAllocations,
  useCreateMonthlyIncome,
  useCreateRecurringIncome,
  useUpdateMonthlyIncome,
  useDeleteMonthlyIncome,
  useRecurringIncomes,
  useUpdateRecurringIncome,
  useDeleteRecurringIncome,
  useIncomeTaxes,
  useCreateIncomeTax,
  useUpdateIncomeTax,
  useDeleteIncomeTax,
  useCreateExpense,
  useExpenseItems,
  useUpdateExpense,
  useDeleteExpense,
  useCreateExpenseItem,
  useUpdateExpenseItem,
  useDeleteExpenseItem,
  useBulkDeleteExpenses,
  useBulkMarkExpensesPaid,
  useUpdateMonth,
  useFinalizeMonth,
  useInstallmentGroups,
  useCreateInstallmentGroup,
  useUpdateInstallmentGroup,
  useDeleteInstallmentGroup,
  useRestoreInstallmentOccurrence,
  useRecurringExpenses,
  useCreateRecurringExpense,
  useUpdateRecurringExpense,
  useDeleteRecurringExpense,
  useRestoreRecurringExpenseOccurrence,
} from "../hooks";
import { useMonthDashboardData } from "../hooks/useMonthDashboardData";
import MonthSummaryHeader from "../components/features/month-dashboard/MonthSummaryHeader";
import IncomeOverviewCard from "../components/features/month-dashboard/IncomeOverviewCard";
import CategoryExpenseColumn from "../components/features/month-dashboard/CategoryExpenseColumn";
import BudgetComparisonTable from "../components/features/month-dashboard/BudgetComparisonTable";
import IncomeForm from "../components/features/incomes/IncomeForm/IncomeForm";
import RecurringIncomeForm from "../components/features/incomes/RecurringIncomeForm/RecurringIncomeForm";
import IncomeTaxForm from "../components/features/income-taxes/IncomeTaxForm/IncomeTaxForm";
import IncomeTaxList from "../components/features/income-taxes/IncomeTaxList/IncomeTaxList";
import ExpenseForm from "../components/features/expenses/ExpenseForm/ExpenseForm";
import ExpenseItemForm from "../components/features/expenses/ExpenseItemForm/ExpenseItemForm";
import InstallmentPurchaseForm from "../components/features/installment-groups/InstallmentPurchaseForm/InstallmentPurchaseForm";
import RecurringExpenseForm from "../components/features/recurring-expenses/RecurringExpenseForm/RecurringExpenseForm";
import Modal from "../components/ui/Modal/Modal";
import Button from "../components/ui/Button/Button";
import { formatCurrencyBRL } from "../utils/currency";
import type {
  MonthlyIncome,
  CreateMonthlyIncomeDTO,
  UpdateMonthlyIncomeDTO,
  CreateRecurringIncomeDTO,
  RecurringIncome,
  UpdateRecurringIncomeDTO,
  IncomeTax,
  CreateIncomeTaxDTO,
  UpdateIncomeTaxDTO,
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
  CreateInstallmentGroupDTO,
  DeleteInstallmentGroupDTO,
  InstallmentGroup,
  InstallmentGroupScope,
  CreateRecurringExpenseDTO,
  DeleteRecurringExpenseDTO,
  RecurringExpense,
  RecurringExpenseScope,
  UpdateInstallmentGroupDTO,
  UpdateRecurringExpenseDTO,
  ExpenseItem,
  CreateExpenseItemDTO,
} from "../types";

const MONTH_NAMES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const COLUMN_CONFIG: { type: string; title: string; color: string }[] = [
  { type: "essential", title: "Gastos Essenciais", color: "#991b1b" },
  { type: "necessary", title: "Gastos Necessários", color: "#b45309" },
  { type: "lifestyle", title: "Gastos Supérfluos", color: "#7c3aed" },
  { type: "investment", title: "Investimentos", color: "#0369a1" },
];

export default function MonthDetailPage() {
  const { userId, monthId } = useParams<{ userId?: string; monthId: string }>();
  const dashboard = useMonthDashboardData({ userId, monthId: monthId! });
  const resolvedUserId = dashboard.month?.user_id ?? userId;
  const ownerContext = { userId: resolvedUserId };
  const { data: installmentGroups = [] } = useInstallmentGroups(ownerContext);
  const { data: recurringExpenses = [] } = useRecurringExpenses(ownerContext);
  const { data: recurringIncomes = [] } = useRecurringIncomes(ownerContext);
  const [selectedBudgetRuleId, setSelectedBudgetRuleId] = useState("");
  const { data: budgetAllocations } = useBudgetAllocations(selectedBudgetRuleId);

  const createIncome = useCreateMonthlyIncome();
  const updateIncome = useUpdateMonthlyIncome();
  const deleteIncome = useDeleteMonthlyIncome();
  const createRecurringIncome = useCreateRecurringIncome();
  const updateRecurringIncome = useUpdateRecurringIncome();
  const deleteRecurringIncome = useDeleteRecurringIncome();
  const createTax = useCreateIncomeTax();
  const updateTax = useUpdateIncomeTax();
  const deleteTax = useDeleteIncomeTax();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const createExpenseItem = useCreateExpenseItem();
  const updateExpenseItem = useUpdateExpenseItem();
  const deleteExpenseItem = useDeleteExpenseItem();
  const bulkDeleteExpenses = useBulkDeleteExpenses();
  const bulkMarkExpensesPaid = useBulkMarkExpensesPaid();
  const updateMonth = useUpdateMonth();
  const finalizeMonth = useFinalizeMonth();
  const createInstallmentGroup = useCreateInstallmentGroup();
  const updateInstallmentGroup = useUpdateInstallmentGroup();
  const deleteInstallmentGroup = useDeleteInstallmentGroup();
  const restoreInstallmentOccurrence = useRestoreInstallmentOccurrence();
  const createRecurringExpense = useCreateRecurringExpense();
  const updateRecurringExpense = useUpdateRecurringExpense();
  const deleteRecurringExpense = useDeleteRecurringExpense();
  const restoreRecurringExpenseOccurrence = useRestoreRecurringExpenseOccurrence();

  // Modal states
  const [incomeModal, setIncomeModal] = useState<{ open: boolean; editing?: MonthlyIncome }>({ open: false });
  const [recurringIncomeModal, setRecurringIncomeModal] = useState<{ open: boolean; editing?: RecurringIncome }>({ open: false });
  const [taxModal, setTaxModal] = useState<{ open: boolean; income?: MonthlyIncome }>({ open: false });
  const [editingTax, setEditingTax] = useState<IncomeTax | undefined>();
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [expenseModal, setExpenseModal] = useState<{ open: boolean; editing?: Expense; prefilterType?: string; forcedExpenseKind?: "standard" | "envelope" }>({ open: false });
  const [envelopeItemsModal, setEnvelopeItemsModal] = useState<{ open: boolean; expense?: Expense }>({ open: false });
  const [envelopeItemFormModal, setEnvelopeItemFormModal] = useState<{ open: boolean; expense?: Expense; editing?: ExpenseItem }>({ open: false });
  const [installmentModal, setInstallmentModal] = useState<{ open: boolean; editing?: InstallmentGroup }>({ open: false });
  const [recurringModal, setRecurringModal] = useState<{ open: boolean; editing?: RecurringExpense; forcedExpenseKind?: "standard" | "envelope" }>({ open: false });
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);
  const [expensePaymentModal, setExpensePaymentModal] = useState<{ open: boolean; expense?: Expense }>({ open: false });
  const [expensePaymentPayer, setExpensePaymentPayer] = useState("");
  const [showRecurringIncomeList, setShowRecurringIncomeList] = useState(false);
  const [showEnvelopeList, setShowEnvelopeList] = useState(false);
  const [showInstallmentList, setShowInstallmentList] = useState(false);
  const [showRecurringExpenseList, setShowRecurringExpenseList] = useState(false);
  const activeEnvelopeExpense = envelopeItemFormModal.expense ?? envelopeItemsModal.expense;
  const { data: selectedEnvelopeItems = [] } = useExpenseItems(activeEnvelopeExpense?.id ?? "");

  const { data: selectedTaxes } = useIncomeTaxes(taxModal.income?.id ?? "");
  const taxMutationError = createTax.error ?? updateTax.error ?? deleteTax.error;
  const installmentMutationError = createInstallmentGroup.error ?? updateInstallmentGroup.error ?? deleteInstallmentGroup.error ?? restoreInstallmentOccurrence.error;
  const recurringMutationError = createRecurringExpense.error ?? updateRecurringExpense.error ?? deleteRecurringExpense.error ?? restoreRecurringExpenseOccurrence.error;
  const recurringIncomeMutationError = createRecurringIncome.error ?? updateRecurringIncome.error ?? deleteRecurringIncome.error;
  const envelopeMutationError = createExpense.error
    ?? updateExpense.error
    ?? deleteExpense.error
    ?? createExpenseItem.error
    ?? updateExpenseItem.error
    ?? deleteExpenseItem.error
    ?? createRecurringExpense.error
    ?? updateRecurringExpense.error
    ?? deleteRecurringExpense.error;
  const expenseMutationError = createExpense.error ?? updateExpense.error ?? deleteExpense.error ?? bulkDeleteExpenses.error ?? bulkMarkExpensesPaid.error;
  const monthMutationError = updateMonth.error ?? finalizeMonth.error;
  const isMonthClosed = dashboard.month?.status === "closed";
  const monthEnvelopes = dashboard.expenses.filter((expense) => expense.expense_kind === "envelope");
  const recurringEnvelopeExpenses = recurringExpenses.filter((expense) => expense.expense_kind === "envelope");
  const recurringStandardExpenses = recurringExpenses.filter((expense) => expense.expense_kind !== "envelope");

  const currentMonthRecurringExpenseIds = new Set(
    dashboard.expenses.filter((expense) => expense.recurring_expense_id).map((expense) => expense.recurring_expense_id as string)
  );
  const currentMonthInstallmentGroupIds = new Set(
    dashboard.expenses.filter((expense) => expense.installment_group_id).map((expense) => expense.installment_group_id as string)
  );

  const promptScope = (resourceLabel: string): { scope: RecurringExpenseScope | InstallmentGroupScope; effective_month_id?: string } | null => {
    const input = window.prompt(
      `Escolha o escopo para ${resourceLabel}:\n1 = apenas este mês\n2 = deste mês em diante\n3 = série inteira`,
      "1"
    );

    if (!input) {
      return null;
    }

    const normalized = input.trim();
    if (normalized === "1") {
      return { scope: "single_occurrence", effective_month_id: monthId };
    }

    if (normalized === "2") {
      return { scope: "future_occurrences", effective_month_id: monthId };
    }

    if (normalized === "3") {
      return { scope: "whole_series" };
    }

    window.alert("Escopo inválido. Use 1, 2 ou 3.");
    return null;
  };

  const blockWhenClosed = (action: () => void) => {
    if (isMonthClosed) {
      window.alert("Este mês está fechado. Ação bloqueada.");
      return;
    }

    action();
  };

  useEffect(() => {
    const availableRuleIds = dashboard.budgetRules.map((rule) => rule.id);
    const persistedBudgetRuleId = dashboard.month?.budget_rule_id ?? "";

    if (availableRuleIds.length === 0) {
      if (selectedBudgetRuleId) {
        setSelectedBudgetRuleId("");
      }
      return;
    }

    if (persistedBudgetRuleId && availableRuleIds.includes(persistedBudgetRuleId)) {
      if (selectedBudgetRuleId !== persistedBudgetRuleId) {
        setSelectedBudgetRuleId(persistedBudgetRuleId);
      }
      return;
    }

    if (selectedBudgetRuleId && !availableRuleIds.includes(selectedBudgetRuleId)) {
      setSelectedBudgetRuleId("");
    }
  }, [dashboard.budgetRules, dashboard.month?.budget_rule_id, selectedBudgetRuleId]);

  const handleBudgetRuleChange = (budgetRuleId: string) => {
    if (!dashboard.month) {
      return;
    }

    setSelectedBudgetRuleId(budgetRuleId);
    updateMonth.mutate({
      id: dashboard.month.id,
      dto: { budget_rule_id: budgetRuleId || null },
    }, {
      onError: () => {
        setSelectedBudgetRuleId(dashboard.month?.budget_rule_id ?? "");
      },
    });
  };

  // Income handlers
  const handleCreateIncome = (data: CreateMonthlyIncomeDTO) => {
    blockWhenClosed(() => {
      createIncome.mutate(data, { onSuccess: () => setIncomeModal({ open: false }) });
    });
  };

  const handleUpdateIncome = (data: CreateMonthlyIncomeDTO) => {
    if (!incomeModal.editing) return;
    const editingIncome = incomeModal.editing;
    const dto: UpdateMonthlyIncomeDTO = {
      gross_income: data.gross_income,
      income_type: data.income_type,
      notes: data.notes,
      taxation: data.taxation,
    };
    blockWhenClosed(() => {
      updateIncome.mutate({ id: editingIncome.id, dto }, { onSuccess: () => setIncomeModal({ open: false }) });
    });
  };

  const handleDeleteIncome = (id: string) => {
    if (window.confirm("Excluir esta receita?")) {
      blockWhenClosed(() => deleteIncome.mutate(id));
    }
  };

  const handleCreateRecurringIncome = (data: CreateRecurringIncomeDTO) => {
    blockWhenClosed(() => {
      createRecurringIncome.mutate(data, { onSuccess: () => setRecurringIncomeModal({ open: false }) });
    });
  };

  const handleUpdateRecurringIncome = (data: CreateRecurringIncomeDTO) => {
    if (!recurringIncomeModal.editing) return;
    const editingRecurringIncome = recurringIncomeModal.editing;

    const dto: UpdateRecurringIncomeDTO = {
      description: data.description,
      gross_income: data.gross_income,
      income_type: data.income_type,
      kind: data.kind,
      status: data.status,
    };

    blockWhenClosed(() => {
      updateRecurringIncome.mutate({ id: editingRecurringIncome.id, dto }, { onSuccess: () => setRecurringIncomeModal({ open: false }) });
    });
  };

  const handleDeleteRecurringIncome = (recurringIncome: RecurringIncome) => {
    if (window.confirm(`Excluir a recorrência \"${recurringIncome.description}\" e as receitas geradas?`)) {
      blockWhenClosed(() => deleteRecurringIncome.mutate(recurringIncome.id));
    }
  };

  const handleCreateTax = (data: CreateIncomeTaxDTO) => {
    blockWhenClosed(() => {
      createTax.mutate(data, { onSuccess: () => setShowTaxForm(false) });
    });
  };

  const handleUpdateTax = (data: CreateIncomeTaxDTO) => {
    if (!editingTax) return;
    if (editingTax.is_auto) {
      window.alert("Impostos automáticos são recalculados pela receita e não podem ser editados manualmente.");
      return;
    }
    const dto: UpdateIncomeTaxDTO = { tax_type: data.tax_type, value: data.value, is_auto: data.is_auto };
    blockWhenClosed(() => {
      updateTax.mutate({ id: editingTax.id, dto }, { onSuccess: () => setEditingTax(undefined) });
    });
  };

  const handleDeleteTax = (tax: IncomeTax) => {
    if (tax.is_auto) {
      window.alert("Impostos automáticos são recalculados pela receita e não podem ser excluídos manualmente.");
      return;
    }

    if (window.confirm("Excluir este imposto?")) {
      blockWhenClosed(() => deleteTax.mutate(tax.id));
    }
  };

  // Expense handlers
  const handleCreateExpense = (data: CreateExpenseDTO) => {
    blockWhenClosed(() => {
      createExpense.mutate(data, { onSuccess: () => setExpenseModal({ open: false }) });
    });
  };

  const handleUpdateExpense = (data: CreateExpenseDTO) => {
    if (!expenseModal.editing) return;
    const editingExpense = expenseModal.editing;
    const dto: UpdateExpenseDTO = {
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      expense_kind: data.expense_kind,
      planned_amount: data.planned_amount,
      description: data.description,
      value: editingExpense.expense_kind === "envelope" ? undefined : data.value,
      payment_date: data.payment_date,
      paid_by: data.paid_by,
    };
    blockWhenClosed(() => {
      updateExpense.mutate({ id: editingExpense.id, dto }, { onSuccess: () => setExpenseModal({ open: false }) });
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm("Excluir esta despesa?")) {
      blockWhenClosed(() => deleteExpense.mutate(id));
    }
  };

  const handleToggleExpenseSelection = (expenseId: string) => {
    setSelectedExpenseIds((current) => (
      current.includes(expenseId)
        ? current.filter((id) => id !== expenseId)
        : [...current, expenseId]
    ));
  };

  const handleBulkDeleteExpenses = () => {
    if (selectedExpenseIds.length === 0 || !monthId || !dashboard.month?.user_id) {
      return;
    }

    if (!window.confirm(`Excluir ${selectedExpenseIds.length} despesa(s) selecionada(s)?`)) {
      return;
    }

    blockWhenClosed(() => {
      bulkDeleteExpenses.mutate(
        {
          user_id: dashboard.month!.user_id!,
          month_id: monthId,
          expense_ids: selectedExpenseIds,
        },
        {
          onSuccess: () => setSelectedExpenseIds([]),
        }
      );
    });
  };

  const handleBulkMarkExpensesAsPaid = () => {
    if (selectedExpenseIds.length === 0 || !monthId || !dashboard.month?.user_id) {
      return;
    }

    if (!window.confirm(`Marcar ${selectedExpenseIds.length} despesa(s) selecionada(s) como paga(s)?`)) {
      return;
    }

    blockWhenClosed(() => {
      bulkMarkExpensesPaid.mutate(
        {
          user_id: dashboard.month!.user_id!,
          month_id: monthId,
          expense_ids: selectedExpenseIds,
        },
        {
          onSuccess: () => setSelectedExpenseIds([]),
        }
      );
    });
  };

  const handleToggleExpensePaid = (expense: Expense) => {
    if (expense.is_paid) {
      blockWhenClosed(() => {
        updateExpense.mutate({
          id: expense.id,
          dto: { is_paid: false, paid_by: undefined },
        });
      });
      return;
    }

    setExpensePaymentPayer(expense.paid_by ?? "");
    setExpensePaymentModal({ open: true, expense });
  };

  const handleCreateExpenseItem = (data: CreateExpenseItemDTO) => {
    const selectedExpense = envelopeItemFormModal.expense;
    if (!selectedExpense) return;

    blockWhenClosed(() => {
      createExpenseItem.mutate({ expenseId: selectedExpense.id, dto: data }, {
        onSuccess: () => setEnvelopeItemFormModal({ open: false, expense: selectedExpense }),
      });
    });
  };

  const handleUpdateExpenseItem = (data: CreateExpenseItemDTO) => {
    const editingItem = envelopeItemFormModal.editing;
    const selectedExpense = envelopeItemFormModal.expense;
    if (!editingItem || !selectedExpense) return;

    blockWhenClosed(() => {
      updateExpenseItem.mutate({ itemId: editingItem.id, dto: data }, {
        onSuccess: () => setEnvelopeItemFormModal({ open: false, expense: selectedExpense }),
      });
    });
  };

  const handleDeleteExpenseItem = (item: ExpenseItem) => {
    if (!window.confirm(`Excluir o item \"${item.description}\"?`)) {
      return;
    }

    blockWhenClosed(() => deleteExpenseItem.mutate(item.id));
  };

  const handleConfirmExpensePaid = () => {
    const selectedExpense = expensePaymentModal.expense;

    if (!selectedExpense) {
      return;
    }

    blockWhenClosed(() => {
      updateExpense.mutate({
        id: selectedExpense.id,
        dto: {
          is_paid: true,
          paid_by: expensePaymentPayer || undefined,
          payment_date: new Date().toISOString().split("T")[0],
        },
      }, {
        onSuccess: () => {
          setExpensePaymentModal({ open: false });
          setExpensePaymentPayer("");
        },
      });
    });
  };

  const handleCreateInstallmentGroup = (data: CreateInstallmentGroupDTO) => {
    blockWhenClosed(() => {
      createInstallmentGroup.mutate(data, { onSuccess: () => setInstallmentModal({ open: false }) });
    });
  };

  const handleUpdateInstallmentGroup = (data: CreateInstallmentGroupDTO) => {
    if (!installmentModal.editing) return;

    const scopeChoice = promptScope(`o parcelamento \"${installmentModal.editing.description}\"`);
    if (!scopeChoice) {
      return;
    }

    const dto: UpdateInstallmentGroupDTO = {
      description: data.description,
      total_value: data.total_value,
      installments: data.installments,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      paid_by: data.paid_by,
      responsible_user_id: data.responsible_user_id,
      scope: scopeChoice.scope,
      effective_month_id: scopeChoice.effective_month_id,
    };

    blockWhenClosed(() => {
      updateInstallmentGroup.mutate(
        { id: installmentModal.editing!.id, dto },
        { onSuccess: () => setInstallmentModal({ open: false }) }
      );
    });
  };

  const handleDeleteInstallmentGroup = (group: InstallmentGroup) => {
    const scopeChoice = promptScope(`o parcelamento \"${group.description}\"`);
    if (!scopeChoice) {
      return;
    }

    const dto: DeleteInstallmentGroupDTO = {
      scope: scopeChoice.scope,
      effective_month_id: scopeChoice.effective_month_id,
    };

    blockWhenClosed(() => deleteInstallmentGroup.mutate({ id: group.id, dto }));
  };

  const handleToggleInstallmentOccurrence = (group: InstallmentGroup) => {
    const hasCurrentOccurrence = currentMonthInstallmentGroupIds.has(group.id);

    blockWhenClosed(() => {
      if (hasCurrentOccurrence) {
        deleteInstallmentGroup.mutate({
          id: group.id,
          dto: { scope: "single_occurrence", effective_month_id: monthId },
        });
        return;
      }

      restoreInstallmentOccurrence.mutate({
        id: group.id,
        dto: { month_id: monthId! },
      });
    });
  };

  const handleCreateRecurringExpense = (data: CreateRecurringExpenseDTO) => {
    blockWhenClosed(() => {
      createRecurringExpense.mutate(data, { onSuccess: () => setRecurringModal({ open: false }) });
    });
  };

  const handleUpdateRecurringExpense = (data: CreateRecurringExpenseDTO) => {
    if (!recurringModal.editing) return;
    const editingRecurringExpense = recurringModal.editing;
    const scopeChoice = promptScope(`a recorrência \"${editingRecurringExpense.description}\"`);
    if (!scopeChoice) {
      return;
    }

    const dto: UpdateRecurringExpenseDTO = {
      description: data.description,
      value: data.value,
      expense_kind: data.expense_kind,
      planned_amount: data.planned_amount,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      paid_by: data.paid_by,
      responsible_user_id: data.responsible_user_id,
      status: data.status,
      scope: scopeChoice.scope,
      effective_month_id: scopeChoice.effective_month_id,
    };

    blockWhenClosed(() => {
      updateRecurringExpense.mutate(
        { id: editingRecurringExpense.id, dto },
        { onSuccess: () => setRecurringModal({ open: false }) }
      );
    });
  };

  const handleDeleteRecurringExpense = (recurringExpense: RecurringExpense) => {
    const scopeChoice = promptScope(`a recorrência \"${recurringExpense.description}\"`);
    if (!scopeChoice) {
      return;
    }

    const dto: DeleteRecurringExpenseDTO = {
      scope: scopeChoice.scope,
      effective_month_id: scopeChoice.effective_month_id,
    };

    blockWhenClosed(() => deleteRecurringExpense.mutate({ id: recurringExpense.id, dto }));
  };

  const handleToggleRecurringOccurrence = (recurringExpense: RecurringExpense) => {
    const hasCurrentOccurrence = currentMonthRecurringExpenseIds.has(recurringExpense.id);

    blockWhenClosed(() => {
      if (hasCurrentOccurrence) {
        deleteRecurringExpense.mutate({
          id: recurringExpense.id,
          dto: { scope: "single_occurrence", effective_month_id: monthId },
        });
        return;
      }

      restoreRecurringExpenseOccurrence.mutate({
        id: recurringExpense.id,
        dto: { month_id: monthId! },
      });
    });
  };

  const handleFinalizeMonth = () => {
    if (!monthId || isMonthClosed) {
      return;
    }

    if (!window.confirm(`Finalizar ${monthLabel}? Depois disso, ações incompatíveis serão bloqueadas.`)) {
      return;
    }

    finalizeMonth.mutate(monthId);
  };

  if (dashboard.isLoading) return <p>Carregando...</p>;

  const monthLabel = dashboard.month ? `${MONTH_NAMES[dashboard.month.month]} ${dashboard.month.year}` : "Mês";
  const selectedIncomeGross = Number(taxModal.income?.gross_income ?? 0);
  const selectedIncomeTaxTotal = (selectedTaxes ?? []).reduce((sum, tax) => sum + Number(tax.value), 0);
  const selectedIncomeNet = selectedIncomeGross - selectedIncomeTaxTotal;
  const planningBaseIncome = dashboard.netIncome;

  // Filter categories for expense form based on prefilter type
  const formCategories = expenseModal.prefilterType
    ? dashboard.categories.filter((c) => c.type === expenseModal.prefilterType)
    : dashboard.categories;
  const expenseModalKind = expenseModal.forcedExpenseKind ?? (expenseModal.editing?.expense_kind as "standard" | "envelope" | undefined) ?? "standard";
  const recurringModalKind = recurringModal.forcedExpenseKind ?? (recurringModal.editing?.expense_kind as "standard" | "envelope" | undefined) ?? "standard";

  return (
    <div className="page">
      <Link to={resolvedUserId ? `/users/${resolvedUserId}/months` : "/"} className="page-back-link">
        ← Voltar para meses
      </Link>

      <section className="page-hero">
        <div className="page-hero__content">
          <div className="page-hero__eyebrow">Painel do período</div>
          <h1 className="page-title">{dashboard.currentUserName ?? "Usuário"} — {monthLabel}</h1>
          <p className="page-subtitle">Concentre receitas, impostos, despesas e automatizações do mês em uma leitura única e mais organizada.</p>
        </div>
        <div className="page-hero__actions">
          <div className={isMonthClosed ? "status-pill" : "status-pill status-pill--success"}>
            {isMonthClosed ? "Mês fechado" : "Mês aberto"}
          </div>
          {!isMonthClosed && (
            <Button onClick={handleFinalizeMonth} disabled={finalizeMonth.isPending}>
              {finalizeMonth.isPending ? "Finalizando..." : "Finalizar mês"}
            </Button>
          )}
          {resolvedUserId && (
            <div className="page-hero__links">
              <Link to={`/users/${resolvedUserId}/budgets`}>
                Gerenciar orçamento
              </Link>
            </div>
          )}
        </div>
      </section>

      {isMonthClosed && (
        <div className="alert-banner">
          Este mês está fechado. Criação, edição e exclusão de lançamentos estão bloqueadas.
        </div>
      )}

      {monthMutationError && (
        <p className="error-banner">
          Erro: {monthMutationError.message || "Falha ao finalizar o mês."}
        </p>
      )}

      {expenseMutationError && (
        <p className="error-banner">
          Erro: {expenseMutationError.message || "Falha ao salvar despesas."}
        </p>
      )}

      {/* Summary Header */}
      <MonthSummaryHeader
        grossIncome={dashboard.grossIncome}
        totalTaxes={dashboard.totalTaxes}
        netIncome={dashboard.netIncome}
        totalPlanned={dashboard.totalPlanned}
        totalExpenses={dashboard.totalExpenses}
        balance={dashboard.balance}
      />

      <div className="summary-shell">
        <IncomeOverviewCard
          incomes={dashboard.incomes}
          taxes={dashboard.allTaxes}
          onAddIncome={() => setIncomeModal({ open: true })}
          onEditIncome={(i) => setIncomeModal({ open: true, editing: i })}
          onManageTaxes={(income) => { setTaxModal({ open: true, income }); setShowTaxForm(false); setEditingTax(undefined); }}
          onDeleteIncome={handleDeleteIncome}
        />
      </div>

      <section className="page-section surface-card">
        <div className="page-section__header">
          <div>
            <div className="section-label">Extrato categorizado</div>
            <h2 className="page-section__title">Gastos por tipo</h2>
            <p className="page-section__subtitle">
              Visualize despesas e envelopes nas colunas do mês, com leitura rápida no estilo extrato.
            </p>
          </div>
          <div className="section-panel__controls">
              <p className="muted-text">Os envelopes continuam aparecendo nas colunas, mas o cadastro foi movido para a seção dedicada abaixo.</p>
          </div>
        </div>

        {envelopeMutationError && (
          <p className="error-banner">
            Erro: {envelopeMutationError.message || "Falha ao salvar envelopes."}
          </p>
        )}

        {dashboard.month?.user_id && (
          <div className="section-toolbar">
            <p className="muted-text">
              {selectedExpenseIds.length === 0
                ? "Selecione despesas para excluir ou marcar como pagas em lote."
                : `${selectedExpenseIds.length} despesa(s) selecionada(s).`}
            </p>
            <div className="action-row">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBulkMarkExpensesAsPaid}
                disabled={selectedExpenseIds.length === 0 || isMonthClosed || bulkMarkExpensesPaid.isPending}
              >
                {bulkMarkExpensesPaid.isPending ? "Marcando..." : "Marcar como pagas"}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleBulkDeleteExpenses}
                disabled={selectedExpenseIds.length === 0 || isMonthClosed || bulkDeleteExpenses.isPending}
              >
                {bulkDeleteExpenses.isPending ? "Excluindo..." : "Excluir selecionadas"}
              </Button>
            </div>
          </div>
        )}
        <div className="month-columns">
          {COLUMN_CONFIG.map((col) => (
            <CategoryExpenseColumn
              key={col.type}
              title={col.title}
              headerColor={col.color}
              items={dashboard.spendingByType[col.type] ?? []}
              defaultExpanded={true}
              selectedExpenseIds={selectedExpenseIds}
              onToggleSelection={handleToggleExpenseSelection}
              onAdd={() => setExpenseModal({ open: true, prefilterType: col.type, forcedExpenseKind: "standard" })}
              onEdit={(e) => setExpenseModal({ open: true, editing: e, forcedExpenseKind: (e.expense_kind === "envelope" ? "envelope" : "standard") })}
              onDelete={handleDeleteExpense}
              onTogglePaid={handleToggleExpensePaid}
              onOpenEnvelopeItems={(expense) => setEnvelopeItemsModal({ open: true, expense })}
            />
          ))}
        </div>
      </section>

      {/* Budget Comparison */}
      <div className="surface-card">
        <div className="page-section__header">
          <div>
            <div className="section-label">Comparativo</div>
            <h2 className="page-section__title">Planejado vs realizado</h2>
            <p className="page-section__subtitle">
              Compare o orçamento planejado por categoria com o gasto real do mês usando a renda líquida, já descontados os impostos.
            </p>
          </div>

          {dashboard.budgetRules.length > 0 && (
            <label className="ui-field inline-select">
              Regra ativa
              <select
                className="ui-select"
                value={selectedBudgetRuleId}
                onChange={(event) => handleBudgetRuleChange(event.target.value)}
                disabled={updateMonth.isPending || isMonthClosed}
              >
                <option value="">Selecione a regra do mês</option>
                {dashboard.budgetRules.map((rule) => (
                  <option key={rule.id} value={rule.id}>{rule.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>

        <BudgetComparisonTable
          allocations={budgetAllocations ?? []}
          categories={dashboard.categories}
          realizedByCategory={dashboard.realizedByCategory}
          planningBaseIncome={planningBaseIncome}
          totalTaxes={dashboard.totalTaxes}
          ruleName={dashboard.budgetRules.find((rule) => rule.id === selectedBudgetRuleId)?.name}
        />
      </div>

      <div className="section-grid">
        <section className="section-panel">
          <div className="section-panel__header">
            <div>
              <h2 className="section-panel__title">Rendas recorrentes</h2>
              <p className="section-panel__subtitle">
                Defina salário fixo e receitas extras que devem aparecer automaticamente nos próximos meses.
              </p>
            </div>
            <div className="section-panel__controls">
              <Button variant="secondary" onClick={() => setShowRecurringIncomeList((current) => !current)}>
                {showRecurringIncomeList ? "Ocultar lista" : "Mostrar lista"}
              </Button>
              <Button onClick={() => setRecurringIncomeModal({ open: true })}>
                Nova renda recorrente
              </Button>
            </div>
          </div>

          {recurringIncomeMutationError && (
            <p className="error-banner">
              Erro: {recurringIncomeMutationError.message || "Falha ao salvar renda recorrente."}
            </p>
          )}

          {!showRecurringIncomeList ? (
            <p className="muted-text">Lista recolhida por padrão. Abra quando quiser revisar ou editar as rendas recorrentes.</p>
          ) : recurringIncomes.length === 0 ? (
            <p className="ui-empty-state">Nenhuma renda recorrente cadastrada.</p>
          ) : (
            <div className="entity-list">
              {recurringIncomes.map((recurringIncome) => (
                <div key={recurringIncome.id} className="entity-item">
                  <div className="entity-item__header">
                    <div>
                      <div className="entity-item__title">{recurringIncome.description}</div>
                      <div className="entity-item__meta">
                        {formatCurrencyBRL(Number(recurringIncome.gross_income))} recorrente a partir deste mês
                      </div>
                      <div className="entity-tags">
                        <span className="entity-tag entity-tag--warn">
                          {recurringIncome.kind === "fixed_salary" ? "Salário fixo" : "Renda extra recorrente"}
                        </span>
                        <span className={recurringIncome.status === "active" ? "entity-tag entity-tag--success" : "entity-tag entity-tag--warn"}>
                          {recurringIncome.status === "active" ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                    </div>
                    <div className="entity-actions">
                      <button
                        className="text-button text-button--primary"
                        onClick={() => setRecurringIncomeModal({ open: true, editing: recurringIncome })}
                      >
                        Editar
                      </button>
                      <button
                        className="text-button text-button--danger"
                        onClick={() => handleDeleteRecurringIncome(recurringIncome)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section-panel">
          <div className="section-panel__header">
            <div>
              <div className="section-panel__eyebrow">Planejamento com itens</div>
              <h2 className="section-panel__title">Envelopes</h2>
              <p className="section-panel__subtitle">
                Cadastre envelopes do mês e modelos recorrentes. O valor atual sera calculado pela soma dos itens adicionados dentro de cada envelope.
              </p>
            </div>
            <div className="section-panel__controls">
              <Button variant="secondary" onClick={() => setShowEnvelopeList((current) => !current)}>
                {showEnvelopeList ? "Ocultar lista" : "Mostrar lista"}
              </Button>
              <Button variant="secondary" onClick={() => setRecurringModal({ open: true, forcedExpenseKind: "envelope" })}>
                Novo envelope recorrente
              </Button>
              <Button onClick={() => setExpenseModal({ open: true, forcedExpenseKind: "envelope" })}>
                Novo envelope
              </Button>
            </div>
          </div>

          {envelopeMutationError && (
            <p className="error-banner">
              Erro: {envelopeMutationError.message || "Falha ao salvar envelope."}
            </p>
          )}

          {!showEnvelopeList ? (
            <p className="muted-text">Lista recolhida por padrão. Abra quando quiser revisar os envelopes do mês e seus modelos recorrentes.</p>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <div className="section-label">Envelopes do mês</div>
                {monthEnvelopes.length === 0 ? (
                  <p className="ui-empty-state">Nenhum envelope criado neste mês.</p>
                ) : (
                  <div className="entity-list">
                    {monthEnvelopes.map((expense) => (
                      <div key={expense.id} className="entity-item">
                        <div className="entity-item__header">
                          <div>
                            <div className="entity-item__title">{expense.description}</div>
                            <div className="entity-item__meta">Planejado: {formatCurrencyBRL(Number(expense.planned_amount ?? 0))}</div>
                            <div className="entity-item__meta">Atual: {formatCurrencyBRL(Number(expense.value))}</div>
                            <div className="entity-tags">
                              <span className={expense.is_paid ? "entity-tag entity-tag--success" : "entity-tag entity-tag--warn"}>
                                {expense.is_paid ? "Pago" : "Em aberto"}
                              </span>
                            </div>
                          </div>
                          <div className="entity-actions">
                            <button className="text-button text-button--primary" onClick={() => setEnvelopeItemsModal({ open: true, expense })}>Itens</button>
                            <button className="text-button text-button--primary" onClick={() => setExpenseModal({ open: true, editing: expense, forcedExpenseKind: "envelope" })}>Editar</button>
                            <button className="text-button text-button--warning" onClick={() => handleToggleExpensePaid(expense)}>{expense.is_paid ? "Desmarcar" : "Pagar"}</button>
                            <button className="text-button text-button--danger" onClick={() => handleDeleteExpense(expense.id)}>Excluir</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="section-label">Envelopes recorrentes</div>
                {recurringEnvelopeExpenses.length === 0 ? (
                  <p className="ui-empty-state">Nenhum envelope recorrente cadastrado.</p>
                ) : (
                  <div className="entity-list">
                    {recurringEnvelopeExpenses.map((item) => (
                      <div key={item.id} className="entity-item">
                        <div className="entity-item__header">
                          <div>
                            <div className="entity-item__title">{item.description}</div>
                            <div className="entity-item__meta">Planejado: {formatCurrencyBRL(Number(item.planned_amount ?? 0))}</div>
                            <div className="entity-tags">
                              <span className={item.status === "active" ? "entity-tag entity-tag--success" : "entity-tag entity-tag--warn"}>
                                {item.status === "active" ? "Ativo" : "Inativo"}
                              </span>
                              {item.occurrences ? <span className="entity-tag entity-tag--warn">{item.occurrences} ocorrência(s)</span> : <span className="entity-tag entity-tag--warn">Sem limite</span>}
                            </div>
                          </div>
                          <div className="entity-actions">
                            <button className="text-button text-button--primary" onClick={() => setRecurringModal({ open: true, editing: item, forcedExpenseKind: "envelope" })}>Editar</button>
                            <button className="text-button text-button--danger" onClick={() => handleDeleteRecurringExpense(item)}>Excluir</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        <section className="section-panel">
          <div className="section-panel__header">
            <div>
              <div className="section-panel__eyebrow">Compromissos em andamento</div>
              <h2 className="section-panel__title">Compras parceladas</h2>
              <p className="section-panel__subtitle">
                Cadastre compras em andamento, inclusive quando você entrou no acompanhamento a partir da parcela atual.
              </p>
            </div>
            <div className="section-panel__controls">
              <Button variant="secondary" onClick={() => setShowInstallmentList((current) => !current)}>
                {showInstallmentList ? "Ocultar lista" : "Mostrar lista"}
              </Button>
              <Button onClick={() => setInstallmentModal({ open: true })}>
                Novo parcelamento
              </Button>
            </div>
          </div>

          {installmentMutationError && (
            <p className="error-banner">
              Erro: {installmentMutationError.message || "Falha ao salvar parcelamento."}
            </p>
          )}

          {!showInstallmentList ? (
            <p className="muted-text">Lista recolhida por padrão. Abra quando quiser revisar os compromissos em andamento.</p>
          ) : installmentGroups.length === 0 ? (
            <p className="ui-empty-state">Nenhum parcelamento cadastrado.</p>
          ) : (
            <div className="entity-list">
              {installmentGroups.map((group) => {
                const startInstallment = group.starting_installment_number ?? 1;
                const remainingInstallments = group.installments - startInstallment + 1;
                const installmentValue = Number(group.total_value) / Number(group.installments || 1);

                return (
                  <div key={group.id} className="entity-item">
                    <div className="entity-item__header">
                      <div>
                        <div className="entity-item__title">{group.description}</div>
                        <div className="entity-item__meta">
                          Parcelas restantes: {startInstallment}/{group.installments} até {group.installments}/{group.installments}
                        </div>
                        <div className="entity-item__meta">
                          {remainingInstallments} lançamento(s) de R$ {installmentValue.toFixed(2)}
                        </div>
                      </div>
                        <div className="entity-actions">
                          <button
                            className="text-button text-button--primary"
                            onClick={() => setInstallmentModal({ open: true, editing: group })}
                          >
                            Editar
                          </button>
                          <button
                            className="text-button text-button--warning"
                            onClick={() => handleToggleInstallmentOccurrence(group)}
                          >
                            {currentMonthInstallmentGroupIds.has(group.id) ? "Remover deste mês" : "Reincluir neste mês"}
                          </button>
                          <button
                            className="text-button text-button--danger"
                            onClick={() => handleDeleteInstallmentGroup(group)}
                          >
                            Excluir
                          </button>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="section-panel">
          <div className="section-panel__header">
            <div>
              <div className="section-panel__eyebrow">Automação de saídas</div>
              <h2 className="section-panel__title">Despesas recorrentes</h2>
              <p className="section-panel__subtitle">
                Automatize contas mensais como aluguel, energia, internet e tributos fixos.
              </p>
            </div>
            <div className="section-panel__controls">
              <Button variant="secondary" onClick={() => setShowRecurringExpenseList((current) => !current)}>
                {showRecurringExpenseList ? "Ocultar lista" : "Mostrar lista"}
              </Button>
              <Button onClick={() => setRecurringModal({ open: true, forcedExpenseKind: "standard" })}>
                Nova recorrência
              </Button>
            </div>
          </div>

          {recurringMutationError && (
            <p className="error-banner">
              Erro: {recurringMutationError.message || "Falha ao salvar recorrência."}
            </p>
          )}

          {!showRecurringExpenseList ? (
            <p className="muted-text">Lista recolhida por padrão. Abra quando quiser revisar ou editar as despesas recorrentes.</p>
          ) : recurringStandardExpenses.length === 0 ? (
            <p className="ui-empty-state">Nenhuma despesa recorrente cadastrada.</p>
          ) : (
            <div className="entity-list">
              {recurringStandardExpenses.map((recurringExpense) => (
                <div key={recurringExpense.id} className="entity-item">
                  <div className="entity-item__header">
                    <div>
                      <div className="entity-item__title">{recurringExpense.description}</div>
                      <div className="entity-item__meta">
                        {formatCurrencyBRL(Number(recurringExpense.value))} recorrente a partir deste mês
                      </div>
                      <div className={recurringExpense.status === "active" ? "entity-tag entity-tag--success" : "entity-tag entity-tag--warn"}>
                        {recurringExpense.status === "active" ? "Ativa" : "Inativa"}
                      </div>
                    </div>
                    <div className="entity-actions">
                      <button
                        className="text-button text-button--primary"
                        onClick={() => setRecurringModal({ open: true, editing: recurringExpense, forcedExpenseKind: "standard" })}
                      >
                        Editar
                      </button>
                      <button
                        className="text-button text-button--warning"
                        onClick={() => handleToggleRecurringOccurrence(recurringExpense)}
                      >
                        {currentMonthRecurringExpenseIds.has(recurringExpense.id) ? "Remover deste mês" : "Reincluir neste mês"}
                      </button>
                      <button
                        className="text-button text-button--danger"
                        onClick={() => handleDeleteRecurringExpense(recurringExpense)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Income Modal */}
      <Modal
        open={incomeModal.open}
        title={incomeModal.editing ? "Editar Receita" : "Nova Receita"}
        onClose={() => setIncomeModal({ open: false })}
      >
        <IncomeForm
          monthId={monthId!}
          defaultUserId={resolvedUserId}
          initialData={incomeModal.editing}
          onSubmit={incomeModal.editing ? handleUpdateIncome : handleCreateIncome}
          onCancel={() => setIncomeModal({ open: false })}
          isPending={incomeModal.editing ? updateIncome.isPending : createIncome.isPending}
        />
      </Modal>

      <Modal
        open={recurringIncomeModal.open}
        title={recurringIncomeModal.editing ? "Editar renda recorrente" : "Nova renda recorrente"}
        onClose={() => setRecurringIncomeModal({ open: false })}
      >
        <RecurringIncomeForm
          defaultUserId={resolvedUserId}
          monthId={monthId!}
          initialData={recurringIncomeModal.editing}
          onSubmit={recurringIncomeModal.editing ? handleUpdateRecurringIncome : handleCreateRecurringIncome}
          onCancel={() => setRecurringIncomeModal({ open: false })}
          isPending={recurringIncomeModal.editing ? updateRecurringIncome.isPending : createRecurringIncome.isPending}
        />
      </Modal>

      <Modal
        open={taxModal.open}
        title={taxModal.income ? `Impostos — ${taxModal.income.income_type}` : "Impostos"}
        onClose={() => { setTaxModal({ open: false }); setEditingTax(undefined); setShowTaxForm(false); }}
      >
        <div className="tax-summary-grid">
          <div className="tax-stat">
            <div className="tax-stat__label">Bruto</div>
            <div className="tax-stat__value">R$ {selectedIncomeGross.toFixed(2)}</div>
          </div>
          <div className="tax-stat tax-stat--danger">
            <div className="tax-stat__label">Impostos</div>
            <div className="tax-stat__value">R$ {selectedIncomeTaxTotal.toFixed(2)}</div>
          </div>
          <div className="tax-stat tax-stat--success">
            <div className="tax-stat__label">Líquido</div>
            <div className="tax-stat__value">R$ {selectedIncomeNet.toFixed(2)}</div>
          </div>
        </div>

        <div className="section-toolbar">
          <div className="muted-text">
            Registre descontos manuais para manter a renda líquida consistente no dashboard.
          </div>
          {!showTaxForm && !editingTax && taxModal.income && (
            <Button onClick={() => setShowTaxForm(true)}>
              Novo Imposto
            </Button>
          )}
        </div>

        {taxMutationError && (
          <p className="error-banner">
            Erro: {taxMutationError.message || "Falha ao salvar imposto."}
          </p>
        )}

        {taxModal.income && showTaxForm && (
          <div className="form-shell">
            <IncomeTaxForm
              incomeId={taxModal.income.id}
              onSubmit={handleCreateTax}
              onCancel={() => setShowTaxForm(false)}
              isPending={createTax.isPending}
            />
          </div>
        )}

        {taxModal.income && editingTax && (
          <div className="form-shell">
            <IncomeTaxForm
              incomeId={taxModal.income.id}
              initialData={editingTax}
              onSubmit={handleUpdateTax}
              onCancel={() => setEditingTax(undefined)}
              isPending={updateTax.isPending}
            />
          </div>
        )}

        <IncomeTaxList
          taxes={selectedTaxes ?? []}
          onEdit={(tax) => {
            if (tax.is_auto) {
              window.alert("Impostos automáticos são calculados pelo backend. Edite a receita para recalcular.");
              return;
            }

            setEditingTax(tax);
            setShowTaxForm(false);
          }}
          onDelete={handleDeleteTax}
        />
      </Modal>

      {/* Expense Modal */}
      <Modal
        open={expenseModal.open}
        title={expenseModal.editing
          ? expenseModalKind === "envelope" ? "Editar envelope" : "Editar despesa"
          : expenseModalKind === "envelope" ? "Novo envelope" : "Nova despesa"}
        onClose={() => setExpenseModal({ open: false })}
      >
        {expenseModal.prefilterType && !expenseModal.editing && expenseModalKind === "standard" && (
          <div className="alert-banner" style={{ marginBottom: 16 }}>
            A categoria desta despesa será definida automaticamente pelo grupo selecionado.
          </div>
        )}
        <ExpenseForm
          userId={resolvedUserId}
          monthId={monthId!}
          categories={expenseModal.editing ? dashboard.categories : formCategories}
          subcategories={dashboard.allSubcategories}
          initialData={expenseModal.editing}
          categoryId={expenseModal.editing ? expenseModal.editing.category_id : formCategories[0]?.id}
          hideCategoryField={!expenseModal.editing && Boolean(expenseModal.prefilterType)}
          hidePaymentFields={!expenseModal.editing}
          forcedExpenseKind={expenseModalKind}
          hideExpenseKindField
          hideValueField={expenseModalKind === "envelope"}
          onSubmit={expenseModal.editing ? handleUpdateExpense : handleCreateExpense}
          onCancel={() => setExpenseModal({ open: false })}
          isPending={expenseModal.editing ? updateExpense.isPending : createExpense.isPending}
        />
      </Modal>

      <Modal
        open={expensePaymentModal.open}
        title="Marcar despesa como paga"
        onClose={() => { setExpensePaymentModal({ open: false }); setExpensePaymentPayer(""); }}
      >
        <div className="form-shell">
          <div>
            <div className="section-label">Pagamento</div>
            <h3 style={{ margin: "8px 0 0" }}>{expensePaymentModal.expense?.description}</h3>
            <p className="muted-text" style={{ marginTop: 8 }}>
              A data será preenchida automaticamente com hoje e você pode editar depois se precisar.
            </p>
            {expensePaymentModal.expense && (
              <p className="muted-text" style={{ marginTop: 8 }}>
                Valor: {formatCurrencyBRL(Number(expensePaymentModal.expense.value))}
              </p>
            )}
          </div>

          <div className="action-row">
            <Button type="button" onClick={handleConfirmExpensePaid} disabled={updateExpense.isPending}>
              {updateExpense.isPending ? "Salvando..." : "Confirmar pagamento"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setExpensePaymentModal({ open: false }); setExpensePaymentPayer(""); }}
              disabled={updateExpense.isPending}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={installmentModal.open}
        title={installmentModal.editing ? "Editar compra parcelada" : "Nova compra parcelada"}
        onClose={() => setInstallmentModal({ open: false })}
      >
        <InstallmentPurchaseForm
          userId={dashboard.month?.user_id}
          monthId={monthId!}
          categories={dashboard.categories}
          subcategories={dashboard.allSubcategories}
          initialData={installmentModal.editing}
          onSubmit={installmentModal.editing ? handleUpdateInstallmentGroup : handleCreateInstallmentGroup}
          onCancel={() => setInstallmentModal({ open: false })}
          isPending={installmentModal.editing ? updateInstallmentGroup.isPending : createInstallmentGroup.isPending}
        />
      </Modal>

      <Modal
        open={recurringModal.open}
        title={recurringModal.editing
          ? recurringModalKind === "envelope" ? "Editar envelope recorrente" : "Editar despesa recorrente"
          : recurringModalKind === "envelope" ? "Novo envelope recorrente" : "Nova despesa recorrente"}
        onClose={() => setRecurringModal({ open: false })}
      >
        <RecurringExpenseForm
          userId={dashboard.month?.user_id}
          monthId={monthId!}
          categories={dashboard.categories}
          subcategories={dashboard.allSubcategories}
          initialData={recurringModal.editing}
          forcedExpenseKind={recurringModalKind}
          hideExpenseKindField
          hideValueField={recurringModalKind === "envelope"}
          onSubmit={recurringModal.editing ? handleUpdateRecurringExpense : handleCreateRecurringExpense}
          onCancel={() => setRecurringModal({ open: false })}
          isPending={recurringModal.editing ? updateRecurringExpense.isPending : createRecurringExpense.isPending}
        />
      </Modal>

      <Modal
        open={envelopeItemsModal.open}
        title={envelopeItemsModal.expense ? `Itens - ${envelopeItemsModal.expense.description}` : "Itens do envelope"}
        onClose={() => setEnvelopeItemsModal({ open: false })}
      >
        {envelopeItemsModal.expense && (
          <div className="form-shell">
            <div>
              <div className="section-label">Resumo</div>
              <h3 style={{ margin: "8px 0 0" }}>{envelopeItemsModal.expense.description}</h3>
              <p className="muted-text" style={{ marginTop: 8 }}>
                Planejado: {formatCurrencyBRL(Number(envelopeItemsModal.expense.planned_amount ?? 0))}.
                Atual: {formatCurrencyBRL(Number(envelopeItemsModal.expense.value))}.
              </p>
            </div>

            <div className="section-toolbar">
              <div className="muted-text">
                {selectedEnvelopeItems.length === 0
                  ? "Nenhum item cadastrado neste envelope ainda."
                  : `${selectedEnvelopeItems.length} item(ns) cadastrados neste envelope.`}
              </div>
              <Button onClick={() => setEnvelopeItemFormModal({ open: true, expense: envelopeItemsModal.expense })}>
                Novo item
              </Button>
            </div>

            {selectedEnvelopeItems.length === 0 ? (
              <p className="ui-empty-state">Nenhum item cadastrado.</p>
            ) : (
              <div className="entity-list">
                {selectedEnvelopeItems.map((item: ExpenseItem) => (
                  <div key={item.id} className="entity-item">
                    <div className="entity-item__header">
                      <div>
                        <div className="entity-item__title">
                          {item.description}
                        </div>
                        <div className="entity-item__meta">
                          {formatCurrencyBRL(Number(item.amount))}
                        </div>
                      </div>
                      <div className="entity-actions">
                        <button className="text-button text-button--primary" onClick={() => setEnvelopeItemFormModal({ open: true, expense: envelopeItemsModal.expense, editing: item })}>Editar</button>
                        <button className="text-button text-button--danger" onClick={() => handleDeleteExpenseItem(item)}>Excluir</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={envelopeItemFormModal.open}
        title={envelopeItemFormModal.editing ? "Editar item do envelope" : "Novo item do envelope"}
        onClose={() => setEnvelopeItemFormModal({ open: false })}
      >
        <ExpenseItemForm
          initialData={envelopeItemFormModal.editing}
          onSubmit={envelopeItemFormModal.editing ? handleUpdateExpenseItem : handleCreateExpenseItem}
          onCancel={() => setEnvelopeItemFormModal({ open: false, expense: envelopeItemsModal.expense })}
          isPending={envelopeItemFormModal.editing ? updateExpenseItem.isPending : createExpenseItem.isPending}
        />
      </Modal>
    </div>
  );
}

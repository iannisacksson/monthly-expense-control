import { useQueries } from "@tanstack/react-query";
import {
  useMonth,
  useMonthlyIncomes,
  useCategories,
  useExpenses,
  useBudgetRules,
  useUser,
} from "./index";
import { incomeTaxService, subcategoryService } from "../services";
import type { IncomeTax, Subcategory, Expense } from "../types";

const TYPE_ORDER = ["essential", "necessary", "lifestyle", "investment"] as const;

export type MonthExpenseListItem = Expense & {
  categoryName: string;
  subcategoryName?: string;
  categoryType: string;
  isEnvelope: boolean;
  plannedAmountValue: number | null;
  varianceAmount: number | null;
  envelopeStatus?: "within_planned" | "at_planned" | "above_planned";
};

const getSortableCreatedAt = (value?: string) => value ?? "";

export function useMonthDashboardData(params: { userId?: string; monthId: string }) {
  const { data: month } = useMonth(params.monthId);
  const { data: incomes, isLoading: loadingIncomes } = useMonthlyIncomes(params.monthId);
  const resolvedUserId = month?.user_id ?? params.userId;
  const { data: categories } = useCategories({ userId: resolvedUserId });
  const { data: expenses, isLoading: loadingExpenses } = useExpenses({ userId: resolvedUserId, monthId: params.monthId });
  const { data: budgetRules } = useBudgetRules({ userId: resolvedUserId });
  const { data: user } = useUser(params.userId ?? "");

  // Load taxes per income
  const incomeIds = incomes?.map((i) => i.id) ?? [];
  const taxQueries = useQueries({
    queries: incomeIds.map((id) => ({
      queryKey: ["income-taxes", id],
      queryFn: () => incomeTaxService.listByIncome(id),
      enabled: !!id,
    })),
  });
  const allTaxes = taxQueries.flatMap((query) => query.data ?? []) as IncomeTax[];

  // Load subcategories per category
  const categoryIds = categories?.map((c) => c.id) ?? [];
  const subQueries = useQueries({
    queries: categoryIds.map((id) => ({
      queryKey: ["subcategories", id],
      queryFn: () => subcategoryService.listByCategory(id),
      enabled: !!id,
    })),
  });
  const allSubcategories = subQueries.flatMap((query) => query.data ?? []) as Subcategory[];

  // Computed values
  const grossIncome = (incomes ?? []).reduce((s, i) => s + Number(i.gross_income), 0);
  const totalTaxes = allTaxes.reduce((s, t) => s + Number(t.value), 0);
  const netIncome = grossIncome - totalTaxes;

  // Group expenses by category type
  const catTypeMap: Record<string, string> = {};
  const categoryNameMap: Record<string, string> = {};
  (categories ?? []).forEach((c) => { catTypeMap[c.id] = c.type; });
  (categories ?? []).forEach((c) => { categoryNameMap[c.id] = c.name; });

  const subcategoryNameMap: Record<string, string> = {};
  allSubcategories.forEach((subcategory) => {
    subcategoryNameMap[subcategory.id] = subcategory.name;
  });

  const expensesByType: Record<string, MonthExpenseListItem[]> = {};
  TYPE_ORDER.forEach((t) => { expensesByType[t] = []; });
  (expenses ?? []).forEach((e) => {
    const type = catTypeMap[e.category_id] ?? "other";
    if (!expensesByType[type]) expensesByType[type] = [];
    const plannedAmountValue = e.planned_amount != null ? Number(e.planned_amount) : null;
    const isEnvelope = e.expense_kind === "envelope";
    const varianceAmount = isEnvelope && plannedAmountValue != null ? Number(e.value) - plannedAmountValue : null;
    const envelopeStatus = !isEnvelope || varianceAmount == null
      ? undefined
      : varianceAmount > 0
        ? "above_planned"
        : varianceAmount === 0
          ? "at_planned"
          : "within_planned";

    expensesByType[type].push({
      ...e,
      categoryType: type,
      categoryName: categoryNameMap[e.category_id] ?? "Categoria não encontrada",
      subcategoryName: e.subcategory_id ? subcategoryNameMap[e.subcategory_id] : undefined,
      isEnvelope,
      plannedAmountValue,
      varianceAmount,
      envelopeStatus,
    });
  });

  const spendingByType: Record<string, MonthExpenseListItem[]> = {};
  TYPE_ORDER.forEach((t) => { spendingByType[t] = []; });

  Object.entries(expensesByType).forEach(([type, typedExpenses]) => {
    if (!spendingByType[type]) {
      spendingByType[type] = [];
    }
    spendingByType[type].push(...typedExpenses);
  });

  Object.values(spendingByType).forEach((items) => {
    items.sort((left, right) => {
      const rightCreatedAt = getSortableCreatedAt(right.created_at);
      const leftCreatedAt = getSortableCreatedAt(left.created_at);

      if (rightCreatedAt && leftCreatedAt) {
        return rightCreatedAt.localeCompare(leftCreatedAt);
      }

      if (rightCreatedAt) {
        return 1;
      }

      if (leftCreatedAt) {
        return -1;
      }

      return right.id.localeCompare(left.id);
    });
  });

  const realizedByCategory: Record<string, number> = {};
  (expenses ?? []).forEach((expense) => {
    realizedByCategory[expense.category_id] = (realizedByCategory[expense.category_id] ?? 0) + Number(expense.value);
  });

  const expensesList = Object.values(spendingByType).flat();
  const totalExpenses = expensesList.reduce((sum, expense) => sum + Number(expense.value), 0);
  const totalEnvelopeActual = expensesList
    .filter((expense) => expense.isEnvelope)
    .reduce((sum, expense) => sum + Number(expense.value), 0);
  const totalEnvelopePlanned = expensesList
    .filter((expense) => expense.isEnvelope)
    .reduce((sum, expense) => sum + Number(expense.plannedAmountValue ?? 0), 0);
  const totalStandaloneExpenses = expensesList
    .filter((expense) => !expense.isEnvelope)
    .reduce((sum, expense) => sum + Number(expense.value), 0);
  const totalPlanned = expensesList.reduce(
    (sum, expense) => sum + (expense.isEnvelope ? Number(expense.plannedAmountValue ?? 0) : Number(expense.value)),
    0,
  );
  const balance = netIncome - totalExpenses;

  const loadingTaxes = taxQueries.some((query) => query.isLoading);
  const loadingSubcategories = subQueries.some((query) => query.isLoading);
  const isLoading = loadingIncomes || loadingExpenses || loadingTaxes || loadingSubcategories;

  return {
    month,
    currentUserName: user?.name,
    incomes: incomes ?? [],
    allTaxes,
    categories: categories ?? [],
    allSubcategories,
    expenses: expensesList,
    expensesByType,
    spendingByType,
    budgetRules: budgetRules ?? [],
    grossIncome,
    totalTaxes,
    netIncome,
    totalPlanned,
    totalExpenses,
    totalStandaloneExpenses,
    totalEnvelopeActual,
    totalEnvelopePlanned,
    realizedByCategory,
    balance,
    isLoading,
  };
}

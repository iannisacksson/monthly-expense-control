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
};

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
    expensesByType[type].push({
      ...e,
      categoryType: type,
      categoryName: categoryNameMap[e.category_id] ?? "Categoria não encontrada",
      subcategoryName: e.subcategory_id ? subcategoryNameMap[e.subcategory_id] : undefined,
    });
  });

  const totalExpenses = (expenses ?? []).reduce((s, e) => s + Number(e.value), 0);
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
    expenses: expenses ?? [],
    expensesByType,
    budgetRules: budgetRules ?? [],
    grossIncome,
    totalTaxes,
    netIncome,
    totalExpenses,
    balance,
    isLoading,
  };
}

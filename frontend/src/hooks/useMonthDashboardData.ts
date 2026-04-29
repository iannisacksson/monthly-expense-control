import { useQueries } from "@tanstack/react-query";
import {
  useFamily,
  useMonth,
  useFamilyMembers,
  useMonthlyIncomes,
  useCategories,
  useExpenses,
  useBudgetRules,
  useDebts,
  useUsers,
} from "./index";
import { incomeTaxService, subcategoryService } from "../services";
import type { IncomeTax, Subcategory, Expense } from "../types";

const TYPE_ORDER = ["essential", "necessary", "lifestyle", "investment"] as const;

export type MonthExpenseListItem = Expense & {
  categoryName: string;
  subcategoryName?: string;
  categoryType: string;
  paidByName?: string;
};

export function useMonthDashboardData(params: { familyId?: string; userId?: string; monthId: string }) {
  const { data: family } = useFamily(params.familyId ?? "");
  const { data: month } = useMonth(params.monthId);
  const { data: members } = useFamilyMembers(params.familyId ?? "");
  const { data: incomes, isLoading: loadingIncomes } = useMonthlyIncomes(params.monthId);
  const resolvedUserId = month?.user_id ?? params.userId;
  const resolvedFamilyId = params.familyId ?? month?.family_id;
  const { data: categories } = useCategories({ familyId: resolvedFamilyId, userId: resolvedUserId });
  const { data: expenses, isLoading: loadingExpenses } = useExpenses({ familyId: resolvedFamilyId, userId: resolvedUserId, monthId: params.monthId });
  const { data: debts } = useDebts(resolvedFamilyId ?? "");
  const { data: budgetRules } = useBudgetRules({ familyId: resolvedFamilyId, userId: resolvedUserId });
  const { data: users } = useUsers();

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

  const userNameMap: Record<string, string> = {};
  (users ?? []).forEach((user) => {
    userNameMap[user.id] = user.name;
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
      paidByName: e.paid_by ? userNameMap[e.paid_by] ?? e.paid_by : undefined,
    });
  });

  const totalExpenses = (expenses ?? []).reduce((s, e) => s + Number(e.value), 0);
  const balance = netIncome - totalExpenses;

  const memberOptions = (members ?? []).map((m) => ({ value: m.user_id, label: userNameMap[m.user_id] ?? m.user_id }));

  const loadingTaxes = taxQueries.some((query) => query.isLoading);
  const loadingSubcategories = subQueries.some((query) => query.isLoading);
  const isLoading = loadingIncomes || loadingExpenses || loadingTaxes || loadingSubcategories;

  return {
    family,
    month,
    members: members ?? [],
    memberOptions,
    incomes: incomes ?? [],
    allTaxes,
    categories: categories ?? [],
    allSubcategories,
    expenses: expenses ?? [],
    expensesByType,
    debts: debts ?? [],
    budgetRules: budgetRules ?? [],
    grossIncome,
    totalTaxes,
    netIncome,
    totalExpenses,
    balance,
    isLoading,
  };
}

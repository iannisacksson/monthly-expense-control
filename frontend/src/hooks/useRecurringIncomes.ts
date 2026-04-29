import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recurringIncomeService } from "../services";
import type { CreateRecurringIncomeDTO, UpdateRecurringIncomeDTO } from "../types";

const RECURRING_INCOMES_KEY = ["recurring-incomes"] as const;

export function useRecurringIncomes(params: { familyId?: string; userId?: string }) {
  const ownerKey = params.userId ? `user:${params.userId}` : params.familyId ? `family:${params.familyId}` : "none";

  return useQuery({
    queryKey: [...RECURRING_INCOMES_KEY, ownerKey],
    queryFn: () => {
      if (params.userId) {
        return recurringIncomeService.listByUser(params.userId);
      }

      if (params.familyId) {
        return recurringIncomeService.listByFamily(params.familyId);
      }

      return Promise.resolve([]);
    },
    enabled: !!params.userId || !!params.familyId,
  });
}

export function useRecurringIncome(id: string) {
  return useQuery({
    queryKey: [...RECURRING_INCOMES_KEY, "detail", id],
    queryFn: () => recurringIncomeService.getById(id),
    enabled: !!id,
  });
}

export function useRecurringIncomeMonthlyIncomes(id: string) {
  return useQuery({
    queryKey: [...RECURRING_INCOMES_KEY, id, "monthly-incomes"],
    queryFn: () => recurringIncomeService.getMonthlyIncomes(id),
    enabled: !!id,
  });
}

export function useCreateRecurringIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateRecurringIncomeDTO) => recurringIncomeService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_INCOMES_KEY });
      queryClient.invalidateQueries({ queryKey: ["monthly-incomes"] });
      queryClient.invalidateQueries({ queryKey: ["income-taxes"] });
      queryClient.invalidateQueries({ queryKey: ["months"] });
    },
  });
}

export function useUpdateRecurringIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRecurringIncomeDTO }) => recurringIncomeService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_INCOMES_KEY });
      queryClient.invalidateQueries({ queryKey: ["monthly-incomes"] });
      queryClient.invalidateQueries({ queryKey: ["income-taxes"] });
      queryClient.invalidateQueries({ queryKey: ["months"] });
    },
  });
}

export function useDeleteRecurringIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recurringIncomeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_INCOMES_KEY });
      queryClient.invalidateQueries({ queryKey: ["monthly-incomes"] });
      queryClient.invalidateQueries({ queryKey: ["income-taxes"] });
      queryClient.invalidateQueries({ queryKey: ["months"] });
    },
  });
}
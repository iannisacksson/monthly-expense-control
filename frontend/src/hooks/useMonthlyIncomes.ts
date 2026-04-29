import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { monthlyIncomeService } from "../services";
import type { CreateMonthlyIncomeDTO, UpdateMonthlyIncomeDTO } from "../types";

const MONTHLY_INCOMES_KEY = ["monthly-incomes"] as const;

export function useMonthlyIncomes(monthId: string) {
  return useQuery({
    queryKey: [...MONTHLY_INCOMES_KEY, monthId],
    queryFn: () => monthlyIncomeService.listByMonth(monthId),
    enabled: !!monthId,
  });
}

export function useMonthlyIncome(id: string) {
  return useQuery({
    queryKey: [...MONTHLY_INCOMES_KEY, "detail", id],
    queryFn: () => monthlyIncomeService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMonthlyIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateMonthlyIncomeDTO) => monthlyIncomeService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHLY_INCOMES_KEY });
      queryClient.invalidateQueries({ queryKey: ["income-taxes"] });
    },
  });
}

export function useUpdateMonthlyIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMonthlyIncomeDTO }) =>
      monthlyIncomeService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHLY_INCOMES_KEY });
      queryClient.invalidateQueries({ queryKey: ["income-taxes"] });
    },
  });
}

export function useDeleteMonthlyIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => monthlyIncomeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHLY_INCOMES_KEY });
      queryClient.invalidateQueries({ queryKey: ["income-taxes"] });
    },
  });
}

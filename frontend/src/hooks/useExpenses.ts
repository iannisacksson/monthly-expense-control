import type { BulkDeleteExpensesDTO, BulkMarkExpensesPaidDTO, CreateExpenseDTO, UpdateExpenseDTO } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "../services";

const EXPENSES_KEY = ["expenses"] as const;

export function useExpenses(params: { userId?: string; monthId: string }) {
  const ownerKey = params.userId ? `user:${params.userId}` : "none";

  return useQuery({
    queryKey: [...EXPENSES_KEY, ownerKey, params.monthId],
    queryFn: () => {
      if (params.userId) {
        return expenseService.listByUserAndMonth(params.userId, params.monthId);
      }

      return Promise.resolve([]);
    },
    enabled: !!params.userId && !!params.monthId,
  });
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: [...EXPENSES_KEY, "detail", id],
    queryFn: () => expenseService.getById(id),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateExpenseDTO) => expenseService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateExpenseDTO }) =>
      expenseService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useBulkDeleteExpenses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: BulkDeleteExpensesDTO) => expenseService.bulkDelete(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useBulkMarkExpensesPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: BulkMarkExpensesPaidDTO) => expenseService.bulkMarkPaid(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

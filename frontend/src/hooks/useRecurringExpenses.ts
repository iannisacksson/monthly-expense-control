import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recurringExpenseService } from "../services";
import type {
  CreateRecurringExpenseDTO,
  DeleteRecurringExpenseDTO,
  RestoreRecurringExpenseOccurrenceDTO,
  UpdateRecurringExpenseDTO,
} from "../types";

const RECURRING_EXPENSES_KEY = ["recurring-expenses"] as const;

export function useRecurringExpenses(params: { userId?: string }) {
  const ownerKey = params.userId ? `user:${params.userId}` : "none";

  return useQuery({
    queryKey: [...RECURRING_EXPENSES_KEY, ownerKey],
    queryFn: () => {
      if (params.userId) {
        return recurringExpenseService.listByUser(params.userId);
      }

      return Promise.resolve([]);
    },
    enabled: !!params.userId,
  });
}

export function useRecurringExpense(id: string) {
  return useQuery({
    queryKey: [...RECURRING_EXPENSES_KEY, "detail", id],
    queryFn: () => recurringExpenseService.getById(id),
    enabled: !!id,
  });
}

export function useRecurringExpenseExpenses(id: string) {
  return useQuery({
    queryKey: [...RECURRING_EXPENSES_KEY, id, "expenses"],
    queryFn: () => recurringExpenseService.getExpenses(id),
    enabled: !!id,
  });
}

export function useCreateRecurringExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateRecurringExpenseDTO) =>
      recurringExpenseService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_EXPENSES_KEY });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateRecurringExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRecurringExpenseDTO }) =>
      recurringExpenseService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_EXPENSES_KEY });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteRecurringExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto?: DeleteRecurringExpenseDTO;
    }) => recurringExpenseService.delete(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_EXPENSES_KEY });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useRestoreRecurringExpenseOccurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto: RestoreRecurringExpenseOccurrenceDTO;
    }) => recurringExpenseService.restoreOccurrence(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_EXPENSES_KEY });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

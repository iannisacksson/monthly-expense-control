import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debtService } from "../services";
import type { CreateDebtDTO, UpdateDebtDTO } from "../types";

const DEBTS_KEY = ["debts"] as const;

export function useDebts(familyId: string) {
  return useQuery({
    queryKey: [...DEBTS_KEY, familyId],
    queryFn: () => debtService.listByFamily(familyId),
    enabled: !!familyId,
  });
}

export function useDebt(id: string) {
  return useQuery({
    queryKey: [...DEBTS_KEY, "detail", id],
    queryFn: () => debtService.getById(id),
    enabled: !!id,
  });
}

export function useCreateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDebtDTO) => debtService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEY });
    },
  });
}

export function useUpdateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDebtDTO }) =>
      debtService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEY });
    },
  });
}

export function useDeleteDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debtService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEY });
    },
  });
}

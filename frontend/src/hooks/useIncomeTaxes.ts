import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { incomeTaxService } from "../services";
import type { CreateIncomeTaxDTO, UpdateIncomeTaxDTO } from "../types";

const INCOME_TAXES_KEY = ["income-taxes"] as const;

export function useIncomeTaxes(incomeId: string) {
  return useQuery({
    queryKey: [...INCOME_TAXES_KEY, incomeId],
    queryFn: () => incomeTaxService.listByIncome(incomeId),
    enabled: !!incomeId,
  });
}

export function useCreateIncomeTax() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateIncomeTaxDTO) => incomeTaxService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOME_TAXES_KEY });
    },
  });
}

export function useUpdateIncomeTax() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateIncomeTaxDTO }) =>
      incomeTaxService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOME_TAXES_KEY });
    },
  });
}

export function useDeleteIncomeTax() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incomeTaxService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOME_TAXES_KEY });
    },
  });
}

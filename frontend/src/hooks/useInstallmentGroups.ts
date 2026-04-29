import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { installmentGroupService } from "../services";
import type {
  CreateInstallmentGroupDTO,
  DeleteInstallmentGroupDTO,
  RestoreInstallmentOccurrenceDTO,
  UpdateInstallmentGroupDTO,
} from "../types";

const INSTALLMENTS_KEY = ["installment-groups"] as const;

export function useInstallmentGroups(params: { userId?: string }) {
  const ownerKey = params.userId ? `user:${params.userId}` : "none";

  return useQuery({
    queryKey: [...INSTALLMENTS_KEY, ownerKey],
    queryFn: () => {
      if (params.userId) {
        return installmentGroupService.listByUser(params.userId);
      }

      return Promise.resolve([]);
    },
    enabled: !!params.userId,
  });
}

export function useInstallmentGroup(id: string) {
  return useQuery({
    queryKey: [...INSTALLMENTS_KEY, "detail", id],
    queryFn: () => installmentGroupService.getById(id),
    enabled: !!id,
  });
}

export function useInstallmentGroupExpenses(id: string) {
  return useQuery({
    queryKey: [...INSTALLMENTS_KEY, id, "expenses"],
    queryFn: () => installmentGroupService.getExpenses(id),
    enabled: !!id,
  });
}

export function useCreateInstallmentGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateInstallmentGroupDTO) => installmentGroupService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateInstallmentGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateInstallmentGroupDTO }) => installmentGroupService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteInstallmentGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto?: DeleteInstallmentGroupDTO }) => installmentGroupService.delete(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useRestoreInstallmentOccurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RestoreInstallmentOccurrenceDTO }) => installmentGroupService.restoreOccurrence(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

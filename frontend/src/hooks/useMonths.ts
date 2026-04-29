import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { monthService } from "../services";
import type { CreateMonthDTO, UpdateMonthDTO } from "../types";

const MONTHS_KEY = ["months"] as const;

export function useMonths(params: { familyId?: string; userId?: string }) {
  const ownerKey = params.userId ? `user:${params.userId}` : params.familyId ? `family:${params.familyId}` : "none";

  return useQuery({
    queryKey: [...MONTHS_KEY, ownerKey],
    queryFn: () => {
      if (params.userId) {
        return monthService.listByUser(params.userId);
      }

      if (params.familyId) {
        return monthService.listByFamily(params.familyId);
      }

      return Promise.resolve([]);
    },
    enabled: !!params.userId || !!params.familyId,
  });
}

export function useMonth(id: string) {
  return useQuery({
    queryKey: [...MONTHS_KEY, "detail", id],
    queryFn: () => monthService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMonth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateMonthDTO) => monthService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHS_KEY });
    },
  });
}

export function useUpdateMonth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMonthDTO }) =>
      monthService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHS_KEY });
    },
  });
}

export function useFinalizeMonth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => monthService.finalize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHS_KEY });
    },
  });
}

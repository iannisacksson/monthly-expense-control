import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { familyService } from "../services";
import type { CreateFamilyDTO, UpdateFamilyDTO } from "../types";

const FAMILIES_KEY = ["families"] as const;

export function useFamilies() {
  return useQuery({
    queryKey: FAMILIES_KEY,
    queryFn: familyService.list,
  });
}

export function useFamily(id: string) {
  return useQuery({
    queryKey: [...FAMILIES_KEY, id],
    queryFn: () => familyService.getById(id),
    enabled: !!id,
  });
}

export function useCreateFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateFamilyDTO) => familyService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAMILIES_KEY });
    },
  });
}

export function useUpdateFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateFamilyDTO }) =>
      familyService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAMILIES_KEY });
    },
  });
}

export function useDeleteFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => familyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAMILIES_KEY });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subcategoryService } from "../services";
import type { CreateSubcategoryDTO, UpdateSubcategoryDTO } from "../types";

const SUBCATEGORIES_KEY = ["subcategories"] as const;

export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: [...SUBCATEGORIES_KEY, categoryId],
    queryFn: () => subcategoryService.listByCategory(categoryId),
    enabled: !!categoryId,
  });
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSubcategoryDTO) => subcategoryService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBCATEGORIES_KEY });
    },
  });
}

export function useUpdateSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSubcategoryDTO }) =>
      subcategoryService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBCATEGORIES_KEY });
    },
  });
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subcategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBCATEGORIES_KEY });
    },
  });
}

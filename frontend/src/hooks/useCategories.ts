import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../types";

const CATEGORIES_KEY = ["categories"] as const;

export function useCategories(params: { userId?: string }) {
  const ownerKey = params.userId ? `user:${params.userId}` : "none";

  return useQuery({
    queryKey: [...CATEGORIES_KEY, ownerKey],
    queryFn: () => {
      if (params.userId) {
        return categoryService.listByUser(params.userId);
      }

      return Promise.resolve([]);
    },
    enabled: !!params.userId,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "detail", id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDTO) => categoryService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDTO }) =>
      categoryService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

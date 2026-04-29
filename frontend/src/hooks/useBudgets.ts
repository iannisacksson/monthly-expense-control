import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "../services";
import type {
  CreateBudgetRuleDTO,
  UpdateBudgetRuleDTO,
  CreateBudgetAllocationDTO,
  UpdateBudgetAllocationDTO,
} from "../types";

const BUDGET_RULES_KEY = ["budget-rules"] as const;
const BUDGET_ALLOCATIONS_KEY = ["budget-allocations"] as const;

export function useBudgetRules(params: { familyId?: string; userId?: string }) {
  const ownerKey = params.userId ? `user:${params.userId}` : params.familyId ? `family:${params.familyId}` : "none";

  return useQuery({
    queryKey: [...BUDGET_RULES_KEY, ownerKey],
    queryFn: () => {
      if (params.userId) {
        return budgetService.listRulesByUser(params.userId);
      }

      if (params.familyId) {
        return budgetService.listRulesByFamily(params.familyId);
      }

      return Promise.resolve([]);
    },
    enabled: !!params.userId || !!params.familyId,
  });
}

export function useBudgetRule(id: string) {
  return useQuery({
    queryKey: [...BUDGET_RULES_KEY, "detail", id],
    queryFn: () => budgetService.getRuleById(id),
    enabled: !!id,
  });
}

export function useCreateBudgetRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBudgetRuleDTO) => budgetService.createRule(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_RULES_KEY });
    },
  });
}

export function useUpdateBudgetRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBudgetRuleDTO }) =>
      budgetService.updateRule(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_RULES_KEY });
    },
  });
}

export function useDeleteBudgetRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetService.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_RULES_KEY });
    },
  });
}

export function useBudgetAllocations(ruleId: string) {
  return useQuery({
    queryKey: [...BUDGET_ALLOCATIONS_KEY, ruleId],
    queryFn: () => budgetService.listAllocationsByRule(ruleId),
    enabled: !!ruleId,
  });
}

export function useCreateBudgetAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBudgetAllocationDTO) => budgetService.createAllocation(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_ALLOCATIONS_KEY });
    },
  });
}

export function useUpdateBudgetAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBudgetAllocationDTO }) =>
      budgetService.updateAllocation(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_ALLOCATIONS_KEY });
    },
  });
}

export function useDeleteBudgetAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetService.deleteAllocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_ALLOCATIONS_KEY });
    },
  });
}

import httpClient from "./http-client";
import type {
  BudgetRule,
  CreateBudgetRuleDTO,
  UpdateBudgetRuleDTO,
  BudgetAllocation,
  CreateBudgetAllocationDTO,
  UpdateBudgetAllocationDTO,
  ApiSuccessResponse,
} from "../types";

export const budgetService = {
  async listRulesByUser(userId: string): Promise<BudgetRule[]> {
    const { data } = await httpClient.get<BudgetRule[]>(`/budgets/rules/user/${userId}`);
    return data;
  },

  async getRuleById(id: string): Promise<BudgetRule> {
    const { data } = await httpClient.get<BudgetRule>(`/budgets/rules/${id}`);
    return data;
  },

  async createRule(dto: CreateBudgetRuleDTO): Promise<BudgetRule> {
    const { data } = await httpClient.post<BudgetRule>("/budgets/rules", dto);
    return data;
  },

  async updateRule(id: string, dto: UpdateBudgetRuleDTO): Promise<BudgetRule> {
    const { data } = await httpClient.put<BudgetRule>(`/budgets/rules/${id}`, dto);
    return data;
  },

  async deleteRule(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/budgets/rules/${id}`);
    return data;
  },

  async listAllocationsByRule(ruleId: string): Promise<BudgetAllocation[]> {
    const { data } = await httpClient.get<BudgetAllocation[]>(`/budgets/allocations/rule/${ruleId}`);
    return data;
  },

  async createAllocation(dto: CreateBudgetAllocationDTO): Promise<BudgetAllocation> {
    const { data } = await httpClient.post<BudgetAllocation>("/budgets/allocations", dto);
    return data;
  },

  async updateAllocation(id: string, dto: UpdateBudgetAllocationDTO): Promise<BudgetAllocation> {
    const { data } = await httpClient.put<BudgetAllocation>(`/budgets/allocations/${id}`, dto);
    return data;
  },

  async deleteAllocation(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/budgets/allocations/${id}`);
    return data;
  },
};

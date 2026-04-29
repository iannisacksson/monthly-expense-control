import type { Expense, CreateExpenseDTO, UpdateExpenseDTO, ApiSuccessResponse, BulkDeleteExpensesDTO, BulkDeleteExpensesResponse, BulkMarkExpensesPaidDTO, BulkMarkExpensesPaidResponse } from "../types";
import httpClient from "./http-client";

export const expenseService = {
  async listByUserAndMonth(userId: string, monthId: string): Promise<Expense[]> {
    const { data } = await httpClient.get<Expense[]>(`/expenses/user/${userId}/month/${monthId}`);
    return data;
  },

  async listByFamilyAndMonth(familyId: string, monthId: string): Promise<Expense[]> {
    const { data } = await httpClient.get<Expense[]>(`/expenses/family/${familyId}/month/${monthId}`);
    return data;
  },

  async getById(id: string): Promise<Expense> {
    const { data } = await httpClient.get<Expense>(`/expenses/${id}`);
    return data;
  },

  async create(dto: CreateExpenseDTO): Promise<Expense> {
    const { data } = await httpClient.post<Expense>("/expenses", dto);
    return data;
  },

  async update(id: string, dto: UpdateExpenseDTO): Promise<Expense> {
    const { data } = await httpClient.put<Expense>(`/expenses/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/expenses/${id}`);
    return data;
  },

  async bulkDelete(dto: BulkDeleteExpensesDTO): Promise<BulkDeleteExpensesResponse> {
    const { data } = await httpClient.post<BulkDeleteExpensesResponse>("/expenses/bulk-delete", dto);
    return data;
  },

  async bulkMarkPaid(dto: BulkMarkExpensesPaidDTO): Promise<BulkMarkExpensesPaidResponse> {
    const { data } = await httpClient.post<BulkMarkExpensesPaidResponse>("/expenses/bulk-mark-paid", dto);
    return data;
  },
};

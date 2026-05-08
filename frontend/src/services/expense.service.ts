import type { Expense, ExpenseAdjustment, ExpenseItem, CreateExpenseDTO, CreateExpenseItemDTO, UpdateExpenseDTO, UpdateExpenseItemDTO, ApiSuccessResponse, BulkDeleteExpensesDTO, BulkDeleteExpensesResponse, BulkMarkExpensesPaidDTO, BulkMarkExpensesPaidResponse } from "../types";
import httpClient from "./http-client";

export const expenseService = {
  async listByUserAndMonth(userId: string, monthId: string): Promise<Expense[]> {
    const { data } = await httpClient.get<Expense[]>(`/expenses/user/${userId}/month/${monthId}`);
    return data;
  },

  async getById(id: string): Promise<Expense> {
    const { data } = await httpClient.get<Expense>(`/expenses/${id}`);
    return data;
  },

  async listAdjustments(id: string): Promise<ExpenseAdjustment[]> {
    const { data } = await httpClient.get<ExpenseAdjustment[]>(`/expenses/${id}/adjustments`);
    return data;
  },

  async listItems(id: string): Promise<ExpenseItem[]> {
    const { data } = await httpClient.get<ExpenseItem[]>(`/expenses/${id}/items`);
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

  async createItem(expenseId: string, dto: CreateExpenseItemDTO): Promise<ExpenseItem> {
    const { data } = await httpClient.post<ExpenseItem>(`/expenses/${expenseId}/items`, dto);
    return data;
  },

  async updateItem(itemId: string, dto: UpdateExpenseItemDTO): Promise<ExpenseItem> {
    const { data } = await httpClient.put<ExpenseItem>(`/expenses/items/${itemId}`, dto);
    return data;
  },

  async deleteItem(itemId: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/expenses/items/${itemId}`);
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

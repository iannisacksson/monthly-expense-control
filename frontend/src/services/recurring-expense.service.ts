import httpClient from "./http-client";
import type {
  ApiSuccessResponse,
  CreateRecurringExpenseDTO,
  DeleteRecurringExpenseDTO,
  Expense,
  RecurringExpense,
  RestoreRecurringExpenseOccurrenceDTO,
  UpdateRecurringExpenseDTO,
} from "../types";

export const recurringExpenseService = {
  async listByUser(userId: string): Promise<RecurringExpense[]> {
    const { data } = await httpClient.get<RecurringExpense[]>(`/recurring-expenses/user/${userId}`);
    return data;
  },

  async getById(id: string): Promise<RecurringExpense> {
    const { data } = await httpClient.get<RecurringExpense>(`/recurring-expenses/${id}`);
    return data;
  },

  async getExpenses(id: string): Promise<Expense[]> {
    const { data } = await httpClient.get<Expense[]>(`/recurring-expenses/${id}/expenses`);
    return data;
  },

  async create(dto: CreateRecurringExpenseDTO): Promise<RecurringExpense> {
    const { data } = await httpClient.post<RecurringExpense>("/recurring-expenses", dto);
    return data;
  },

  async update(id: string, dto: UpdateRecurringExpenseDTO): Promise<RecurringExpense> {
    const { data } = await httpClient.put<RecurringExpense>(`/recurring-expenses/${id}`, dto);
    return data;
  },

  async restoreOccurrence(id: string, dto: RestoreRecurringExpenseOccurrenceDTO): Promise<Expense> {
    const { data } = await httpClient.post<Expense>(`/recurring-expenses/${id}/restore-occurrence`, dto);
    return data;
  },

  async delete(id: string, dto?: DeleteRecurringExpenseDTO): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/recurring-expenses/${id}`, { data: dto });
    return data;
  },
};
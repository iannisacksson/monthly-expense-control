import httpClient from "./http-client";
import type {
  ApiSuccessResponse,
  CreateRecurringIncomeDTO,
  MonthlyIncome,
  RecurringIncome,
  UpdateRecurringIncomeDTO,
} from "../types";

export const recurringIncomeService = {
  async listByUser(userId: string): Promise<RecurringIncome[]> {
    const { data } = await httpClient.get<RecurringIncome[]>(`/recurring-incomes/user/${userId}`);
    return data;
  },

  async listByFamily(familyId: string): Promise<RecurringIncome[]> {
    const { data } = await httpClient.get<RecurringIncome[]>(`/recurring-incomes/family/${familyId}`);
    return data;
  },

  async getById(id: string): Promise<RecurringIncome> {
    const { data } = await httpClient.get<RecurringIncome>(`/recurring-incomes/${id}`);
    return data;
  },

  async getMonthlyIncomes(id: string): Promise<MonthlyIncome[]> {
    const { data } = await httpClient.get<MonthlyIncome[]>(`/recurring-incomes/${id}/monthly-incomes`);
    return data;
  },

  async create(dto: CreateRecurringIncomeDTO): Promise<RecurringIncome> {
    const { data } = await httpClient.post<RecurringIncome>("/recurring-incomes", dto);
    return data;
  },

  async update(id: string, dto: UpdateRecurringIncomeDTO): Promise<RecurringIncome> {
    const { data } = await httpClient.put<RecurringIncome>(`/recurring-incomes/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/recurring-incomes/${id}`);
    return data;
  },
};
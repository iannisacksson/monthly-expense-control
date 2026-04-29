import httpClient from "./http-client";
import type { MonthlyIncome, CreateMonthlyIncomeDTO, UpdateMonthlyIncomeDTO, ApiSuccessResponse } from "../types";

export const monthlyIncomeService = {
  async listByMonth(monthId: string): Promise<MonthlyIncome[]> {
    const { data } = await httpClient.get<MonthlyIncome[]>(`/monthly-incomes/month/${monthId}`);
    return data;
  },

  async getById(id: string): Promise<MonthlyIncome> {
    const { data } = await httpClient.get<MonthlyIncome>(`/monthly-incomes/${id}`);
    return data;
  },

  async create(dto: CreateMonthlyIncomeDTO): Promise<MonthlyIncome> {
    const { data } = await httpClient.post<MonthlyIncome>("/monthly-incomes", dto);
    return data;
  },

  async update(id: string, dto: UpdateMonthlyIncomeDTO): Promise<MonthlyIncome> {
    const { data } = await httpClient.put<MonthlyIncome>(`/monthly-incomes/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/monthly-incomes/${id}`);
    return data;
  },
};

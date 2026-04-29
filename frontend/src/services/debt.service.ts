import httpClient from "./http-client";
import type { Debt, CreateDebtDTO, UpdateDebtDTO, ApiSuccessResponse } from "../types";

export const debtService = {
  async listByFamily(familyId: string): Promise<Debt[]> {
    const { data } = await httpClient.get<Debt[]>(`/debts/family/${familyId}`);
    return data;
  },

  async getById(id: string): Promise<Debt> {
    const { data } = await httpClient.get<Debt>(`/debts/${id}`);
    return data;
  },

  async create(dto: CreateDebtDTO): Promise<Debt> {
    const { data } = await httpClient.post<Debt>("/debts", dto);
    return data;
  },

  async update(id: string, dto: UpdateDebtDTO): Promise<Debt> {
    const { data } = await httpClient.put<Debt>(`/debts/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/debts/${id}`);
    return data;
  },
};

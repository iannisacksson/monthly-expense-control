import httpClient from "./http-client";
import type { IncomeTax, CreateIncomeTaxDTO, UpdateIncomeTaxDTO, ApiSuccessResponse } from "../types";

export const incomeTaxService = {
  async listByIncome(incomeId: string): Promise<IncomeTax[]> {
    const { data } = await httpClient.get<IncomeTax[]>(`/income-taxes/income/${incomeId}`);
    return data;
  },

  async getById(id: string): Promise<IncomeTax> {
    const { data } = await httpClient.get<IncomeTax>(`/income-taxes/${id}`);
    return data;
  },

  async create(dto: CreateIncomeTaxDTO): Promise<IncomeTax> {
    const { data } = await httpClient.post<IncomeTax>("/income-taxes", dto);
    return data;
  },

  async update(id: string, dto: UpdateIncomeTaxDTO): Promise<IncomeTax> {
    const { data } = await httpClient.put<IncomeTax>(`/income-taxes/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/income-taxes/${id}`);
    return data;
  },
};

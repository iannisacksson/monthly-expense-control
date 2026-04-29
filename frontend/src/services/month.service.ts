import httpClient from "./http-client";
import type { Month, CreateMonthDTO, UpdateMonthDTO, ApiSuccessResponse } from "../types";

export const monthService = {
  async listByUser(userId: string): Promise<Month[]> {
    const { data } = await httpClient.get<Month[]>(`/months/user/${userId}`);
    return data;
  },

  async getById(id: string): Promise<Month> {
    const { data } = await httpClient.get<Month>(`/months/${id}`);
    return data;
  },

  async create(dto: CreateMonthDTO): Promise<Month> {
    const { data } = await httpClient.post<Month>("/months", dto);
    return data;
  },

  async update(id: string, dto: UpdateMonthDTO): Promise<Month> {
    const { data } = await httpClient.put<Month>(`/months/${id}`, dto);
    return data;
  },

  async finalize(id: string): Promise<Month> {
    const { data } = await httpClient.patch<Month>(`/months/${id}/finalize`);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/months/${id}`);
    return data;
  },
};

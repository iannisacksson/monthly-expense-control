import httpClient from "./http-client";
import type { Family, CreateFamilyDTO, UpdateFamilyDTO, ApiSuccessResponse } from "../types";

export const familyService = {
  async list(): Promise<Family[]> {
    const { data } = await httpClient.get<Family[]>("/families");
    return data;
  },

  async getById(id: string): Promise<Family> {
    const { data } = await httpClient.get<Family>(`/families/${id}`);
    return data;
  },

  async create(dto: CreateFamilyDTO): Promise<Family> {
    const { data } = await httpClient.post<Family>("/families", dto);
    return data;
  },

  async update(id: string, dto: UpdateFamilyDTO): Promise<Family> {
    const { data } = await httpClient.put<Family>(`/families/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/families/${id}`);
    return data;
  },
};

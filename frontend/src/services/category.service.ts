import httpClient from "./http-client";
import type { Category, CreateCategoryDTO, UpdateCategoryDTO, ApiSuccessResponse } from "../types";

export const categoryService = {
  async listByUser(userId: string): Promise<Category[]> {
    const { data } = await httpClient.get<Category[]>(`/categories/user/${userId}`);
    return data;
  },

  async listByFamily(familyId: string): Promise<Category[]> {
    const { data } = await httpClient.get<Category[]>(`/categories/family/${familyId}`);
    return data;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await httpClient.get<Category>(`/categories/${id}`);
    return data;
  },

  async create(dto: CreateCategoryDTO): Promise<Category> {
    const { data } = await httpClient.post<Category>("/categories", dto);
    return data;
  },

  async update(id: string, dto: UpdateCategoryDTO): Promise<Category> {
    const { data } = await httpClient.put<Category>(`/categories/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/categories/${id}`);
    return data;
  },
};

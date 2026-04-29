import httpClient from "./http-client";
import type { Subcategory, CreateSubcategoryDTO, UpdateSubcategoryDTO, ApiSuccessResponse } from "../types";

export const subcategoryService = {
  async listByCategory(categoryId: string): Promise<Subcategory[]> {
    const { data } = await httpClient.get<Subcategory[]>(`/subcategories/category/${categoryId}`);
    return data;
  },

  async getById(id: string): Promise<Subcategory> {
    const { data } = await httpClient.get<Subcategory>(`/subcategories/${id}`);
    return data;
  },

  async create(dto: CreateSubcategoryDTO): Promise<Subcategory> {
    const { data } = await httpClient.post<Subcategory>("/subcategories", dto);
    return data;
  },

  async update(id: string, dto: UpdateSubcategoryDTO): Promise<Subcategory> {
    const { data } = await httpClient.put<Subcategory>(`/subcategories/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/subcategories/${id}`);
    return data;
  },
};

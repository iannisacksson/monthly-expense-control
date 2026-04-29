import httpClient from "./http-client";
import type { User, CreateUserDTO, UpdateUserDTO, ApiSuccessResponse } from "../types";

export const userService = {
  async list(): Promise<User[]> {
    const { data } = await httpClient.get<User[]>("/users");
    return data;
  },

  async getById(id: string): Promise<User> {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  },

  async create(dto: CreateUserDTO): Promise<User> {
    const { data } = await httpClient.post<User>("/users", dto);
    return data;
  },

  async update(id: string, dto: UpdateUserDTO): Promise<User> {
    const { data } = await httpClient.put<User>(`/users/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/users/${id}`);
    return data;
  },
};

import httpClient from "./http-client";
import type { RegisterDTO, LoginDTO, LoginResponse, UpdateProfileDTO, ApiSuccessResponse } from "../types";
import type { User } from "../types";

export const authService = {
  async register(dto: RegisterDTO): Promise<Pick<User, "id" | "name" | "email">> {
    const { data } = await httpClient.post<Pick<User, "id" | "name" | "email">>(
      "/auth/register",
      dto
    );
    return data;
  },

  async login(dto: LoginDTO): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>("/auth/login", dto);
    return data;
  },

  async logout(): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.post<ApiSuccessResponse>("/auth/logout");
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await httpClient.get<User>("/auth/me");
    return data;
  },

  async updateMe(dto: UpdateProfileDTO): Promise<User> {
    const { data } = await httpClient.put<User>("/auth/me", dto);
    return data;
  },

  async deleteMe(): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>("/auth/me");
    return data;
  },
};

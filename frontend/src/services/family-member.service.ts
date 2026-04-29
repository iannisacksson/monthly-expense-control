import httpClient from "./http-client";
import type { FamilyMember, CreateFamilyMemberDTO, ApiSuccessResponse } from "../types";

export const familyMemberService = {
  async listByFamily(familyId: string): Promise<FamilyMember[]> {
    const { data } = await httpClient.get<FamilyMember[]>(`/family-members/family/${familyId}`);
    return data;
  },

  async getById(id: string): Promise<FamilyMember> {
    const { data } = await httpClient.get<FamilyMember>(`/family-members/${id}`);
    return data;
  },

  async add(dto: CreateFamilyMemberDTO): Promise<FamilyMember> {
    const { data } = await httpClient.post<FamilyMember>("/family-members", dto);
    return data;
  },

  async remove(id: string): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/family-members/${id}`);
    return data;
  },
};

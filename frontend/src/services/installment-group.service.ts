import httpClient from "./http-client";
import type {
  InstallmentGroup,
  Expense,
  CreateInstallmentGroupDTO,
  ApiSuccessResponse,
  DeleteInstallmentGroupDTO,
  RestoreInstallmentOccurrenceDTO,
  UpdateInstallmentGroupDTO,
} from "../types";

export const installmentGroupService = {
  async listByUser(userId: string): Promise<InstallmentGroup[]> {
    const { data } = await httpClient.get<InstallmentGroup[]>(`/installment-groups/user/${userId}`);
    return data;
  },

  async getById(id: string): Promise<InstallmentGroup> {
    const { data } = await httpClient.get<InstallmentGroup>(`/installment-groups/${id}`);
    return data;
  },

  async getExpenses(id: string): Promise<Expense[]> {
    const { data } = await httpClient.get<Expense[]>(`/installment-groups/${id}/expenses`);
    return data;
  },

  async create(dto: CreateInstallmentGroupDTO): Promise<InstallmentGroup> {
    const { data } = await httpClient.post<InstallmentGroup>("/installment-groups", dto);
    return data;
  },

  async update(id: string, dto: UpdateInstallmentGroupDTO): Promise<InstallmentGroup> {
    const { data } = await httpClient.put<InstallmentGroup>(`/installment-groups/${id}`, dto);
    return data;
  },

  async restoreOccurrence(id: string, dto: RestoreInstallmentOccurrenceDTO): Promise<Expense> {
    const { data } = await httpClient.post<Expense>(`/installment-groups/${id}/restore-occurrence`, dto);
    return data;
  },

  async delete(id: string, dto?: DeleteInstallmentGroupDTO): Promise<ApiSuccessResponse> {
    const { data } = await httpClient.delete<ApiSuccessResponse>(`/installment-groups/${id}`, { data: dto });
    return data;
  },
};

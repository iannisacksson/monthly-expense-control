export type InstallmentGroupScope = "single_occurrence" | "future_occurrences" | "whole_series"

export interface CreateInstallmentGroupDTO {
  user_id?: string
  family_id?: string
  description: string
  total_value: number
  installments: number
  starting_installment_number: number
  category_id: string
  subcategory_id?: string
  paid_by?: string
  responsible_user_id?: string
  start_month_id: string
}

export interface UpdateInstallmentGroupDTO {
  description?: string
  total_value?: number
  installments?: number
  category_id?: string
  subcategory_id?: string
  paid_by?: string
  responsible_user_id?: string
  scope?: InstallmentGroupScope
  effective_month_id?: string
}

export interface RestoreInstallmentOccurrenceDTO {
  month_id: string
}

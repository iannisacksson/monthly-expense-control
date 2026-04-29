import type { IncomeTaxationDTO } from "./monthly-income.dto"

export interface CreateRecurringIncomeDTO {
  user_id: string
  description: string
  gross_income: number
  income_type: string
  kind: string
  start_month_id: string
  occurrences?: number
  status: string
  taxation?: IncomeTaxationDTO
}

export interface UpdateRecurringIncomeDTO {
  description?: string
  gross_income?: number
  income_type?: string
  kind?: string
  occurrences?: number | null
  status?: string
  taxation?: IncomeTaxationDTO
}
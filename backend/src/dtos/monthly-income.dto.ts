export type IncomeTaxationMode = "manual" | "automatic"

export type IncomeTaxationProfile = "me_pro_labore"

export type IncomeTaxationIrrfMode = "disabled" | "manual_amount"

export interface MeProLaboreTaxationParametersDTO {
  accountant_fee: number
  das_rate?: number
  pro_labore_rate?: number
  inss_rate?: number
  irrf_mode?: IncomeTaxationIrrfMode
  irrf_manual_amount?: number
}

export interface IncomeTaxationDTO {
  mode: IncomeTaxationMode
  profile?: IncomeTaxationProfile
  parameters?: MeProLaboreTaxationParametersDTO
}

export interface CreateMonthlyIncomeDTO {
  user_id: string
  month_id: string
  recurring_income_id?: string
  gross_income: number
  income_type: string
  notes?: string
  taxation?: IncomeTaxationDTO
}

export interface UpdateMonthlyIncomeDTO {
  gross_income?: number
  income_type?: string
  notes?: string
  taxation?: IncomeTaxationDTO
}

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
  userId: string;
  monthId: string;
  recurringIncomeId?: string;
  grossIncome: number;
  incomeType: string;
  notes?: string;
  taxation?: IncomeTaxationDTO;
}

export interface UpdateMonthlyIncomeDTO {
  grossIncome?: number;
  incomeType?: string;
  notes?: string;
  taxation?: IncomeTaxationDTO;
}

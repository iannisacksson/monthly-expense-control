import type { IncomeTaxationDTO, IncomeTaxationMode, IncomeTaxationProfile, MeProLaboreTaxationParametersDTO } from "./monthly-income.types";

export interface RecurringIncome {
  id: string;
  user_id: string;
  description: string;
  gross_income: number;
  income_type: string;
  taxation_mode?: IncomeTaxationMode;
  taxation_profile?: IncomeTaxationProfile;
  taxation_parameters?: MeProLaboreTaxationParametersDTO;
  kind: string;
  start_month_id: string;
  occurrences?: number | null;
  status: string;
  created_at: string;
}

export interface CreateRecurringIncomeDTO {
  user_id: string;
  description: string;
  gross_income: number;
  income_type: string;
  kind: string;
  start_month_id: string;
  occurrences?: number | null;
  status: string;
  taxation?: IncomeTaxationDTO;
}

export interface UpdateRecurringIncomeDTO {
  description?: string;
  gross_income?: number;
  income_type?: string;
  kind?: string;
  occurrences?: number | null;
  status?: string;
  taxation?: IncomeTaxationDTO;
}
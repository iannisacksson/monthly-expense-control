export interface CreateIncomeTaxDTO {
  monthly_income_id: string
  tax_type: string
  value: number
  is_auto: boolean
}

export interface UpdateIncomeTaxDTO {
  tax_type?: string
  value?: number
  is_auto?: boolean
}

export interface CreateMonthDTO {
  user_id: string
  year: number
  month: number
  status: string
}

export interface UpdateMonthDTO {
  status?: string
  budget_rule_id?: string | null
}

export interface CreateBudgetRuleDTO {
  user_id?: string
  family_id?: string
  name: string
}

export interface UpdateBudgetRuleDTO {
  name?: string
}

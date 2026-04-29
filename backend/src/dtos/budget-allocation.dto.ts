export interface CreateBudgetAllocationDTO {
  budget_rule_id: string
  category_id: string
  percentage: number
}

export interface UpdateBudgetAllocationDTO {
  category_id?: string
  percentage?: number
}

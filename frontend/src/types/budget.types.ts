export interface BudgetRule {
  id: string;
  user_id?: string;
  family_id?: string;
  name: string;
}

export interface CreateBudgetRuleDTO {
  user_id?: string;
  name: string;
}

export interface UpdateBudgetRuleDTO {
  name?: string;
}

export interface BudgetAllocation {
  id: string;
  budget_rule_id: string;
  category_id: string;
  percentage: number;
}

export interface CreateBudgetAllocationDTO {
  budget_rule_id: string;
  category_id: string;
  percentage: number;
}

export interface UpdateBudgetAllocationDTO {
  category_id?: string;
  percentage?: number;
}

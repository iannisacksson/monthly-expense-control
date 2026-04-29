export interface Month {
  id: string;
  user_id?: string;
  family_id?: string;
  budget_rule_id?: string | null;
  year: number;
  month: number;
  status: string;
  created_at: string;
}

export interface CreateMonthDTO {
  user_id?: string;
  family_id?: string;
  year: number;
  month: number;
  status: string;
}

export interface UpdateMonthDTO {
  status?: string;
  budget_rule_id?: string | null;
}

export interface Debt {
  id: string;
  family_id: string;
  creditor_id: string;
  debtor_id: string;
  expense_id?: string;
  value: number;
  status: string;
  created_at: string;
}

export interface CreateDebtDTO {
  family_id: string;
  creditor_id: string;
  debtor_id: string;
  expense_id?: string;
  value: number;
  status: string;
}

export interface UpdateDebtDTO {
  value?: number;
  status?: string;
}

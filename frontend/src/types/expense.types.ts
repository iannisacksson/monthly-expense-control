export interface Expense {
  id: string;
  month_id: string;
  category_id: string;
  subcategory_id?: string;
  paid_by?: string;
  responsible_user_id?: string;
  installment_group_id?: string;
  recurring_expense_id?: string;
  is_paid: boolean;
  description: string;
  value: number;
  expense_date?: string;
  payment_date?: string;
  created_at: string;
}

export interface CreateExpenseDTO {
  user_id?: string;
  month_id: string;
  category_id: string;
  subcategory_id?: string;
  paid_by?: string;
  responsible_user_id?: string;
  installment_group_id?: string;
  recurring_expense_id?: string;
  description: string;
  value: number;
  expense_date?: string;
  payment_date?: string;
}

export interface UpdateExpenseDTO {
  category_id?: string;
  subcategory_id?: string;
  paid_by?: string;
  responsible_user_id?: string;
  recurring_expense_id?: string;
  is_paid?: boolean;
  description?: string;
  value?: number;
  expense_date?: string;
  payment_date?: string;
}

export interface BulkDeleteExpensesDTO {
  user_id: string;
  month_id: string;
  expense_ids: string[];
}

export interface BulkDeleteExpensesResponse {
  success: true;
  deleted_count: number;
}

export interface BulkMarkExpensesPaidDTO {
  user_id: string;
  month_id: string;
  expense_ids: string[];
  paid_by?: string;
  payment_date?: string;
}

export interface BulkMarkExpensesPaidResponse {
  success: true;
  updated_count: number;
  payment_date: string;
}

export type RecurringExpenseScope = "single_occurrence" | "future_occurrences" | "whole_series";

export interface RecurringExpense {
  user_id?: string;
  id: string;
  description: string;
  value: number;
  category_id: string;
  subcategory_id?: string;
  paid_by?: string;
  responsible_user_id?: string;
  start_month_id: string;
  occurrences?: number | null;
  status: string;
  created_at: string;
}

export interface CreateRecurringExpenseDTO {
  user_id?: string;
  description: string;
  value: number;
  category_id: string;
  subcategory_id?: string;
  paid_by?: string;
  responsible_user_id?: string;
  start_month_id: string;
  occurrences?: number | null;
  status: string;
}

export interface UpdateRecurringExpenseDTO {
  description?: string;
  value?: number;
  category_id?: string;
  subcategory_id?: string;
  paid_by?: string;
  responsible_user_id?: string;
  occurrences?: number | null;
  status?: string;
  scope?: RecurringExpenseScope;
  effective_month_id?: string;
}

export interface DeleteRecurringExpenseDTO {
  scope?: RecurringExpenseScope;
  effective_month_id?: string;
}

export interface RestoreRecurringExpenseOccurrenceDTO {
  month_id: string;
}
import type { MonthlyIncome } from "../../../../domain/entities/monthly-income.entity";

export function serializeMonthlyIncome(income: MonthlyIncome) {
  return {
    id: income.id,
    user_id: income.user.id,
    month_id: income.month.id,
    recurring_income_id: income.recurringIncome?.id ?? null,
    gross_income: income.grossIncome,
    income_type: income.incomeType,
    taxation_mode: income.taxationMode,
    taxation_profile: income.taxationProfile ?? null,
    taxation_parameters: income.taxationParameters ?? null,
    notes: income.notes ?? null,
    created_at: income.createdAt,
    updated_at: income.updatedAt,
  };
}

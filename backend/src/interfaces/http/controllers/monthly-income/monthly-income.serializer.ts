import type { MonthlyIncome } from "../../../../domain/entities/monthly-income.entity";

export function serializeMonthlyIncome(income: MonthlyIncome) {
  return {
    id: income.id,
    user_id: income.userId,
    month_id: income.monthId,
    recurring_income_id: income.recurringIncomeId ?? null,
    gross_income: income.grossIncome,
    income_type: income.incomeType,
    taxation_mode: income.taxationMode,
    taxation_profile: income.taxationProfile ?? null,
    taxation_parameters: income.taxationParameters ?? null,
    notes: income.notes ?? null,
    created_at: income.createdAt,
  };
}

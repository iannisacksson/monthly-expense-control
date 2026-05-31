import type { Transaction } from "sequelize";
import type { MonthlyIncome } from "../entities/monthly-income.entity";

export interface IMonthlyIncomeRepository {
  create(income: Omit<MonthlyIncome, "id" | "createdAt">, options?: { transaction?: Transaction }): Promise<MonthlyIncome>;
  findById(id: string): Promise<MonthlyIncome | null>;
  findByMonthId(monthId: string): Promise<MonthlyIncome[]>;
  findByUserId(userId: string): Promise<MonthlyIncome[]>;
  findByRecurringIncomeId(recurringIncomeId: string): Promise<MonthlyIncome[]>;
  findRecurringIncomeEntry(recurringIncomeId: string, monthId: string): Promise<MonthlyIncome | null>;
  update(
    id: string,
    data: {
      grossIncome?: number;
      incomeType?: string;
      taxationMode?: "manual" | "automatic";
      taxationProfile?: string | null;
      taxationParameters?: Record<string, unknown> | null;
      notes?: string | null;
    },
    options?: { transaction?: Transaction },
  ): Promise<MonthlyIncome | null>;
  delete(income: MonthlyIncome): Promise<void>;
  deleteByRecurringIncomeId(recurringIncomeId: string): Promise<number>;
}

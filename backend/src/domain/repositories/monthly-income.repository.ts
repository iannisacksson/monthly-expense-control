import type { Transaction } from "sequelize";
import type { MonthlyIncome } from "../entities/monthly-income.entity";

export interface IMonthlyIncomeRepository {
  /**
   * Creates a new monthly income entry.
   * @param income Monthly income fields excluding the generated ID and creation timestamp.
   * @param options Optional Sequelize transaction.
   * @returns The created monthly income.
   */
  create(
    income: Omit<MonthlyIncome, "id" | "createdAt">,
    options?: { transaction?: Transaction },
  ): Promise<MonthlyIncome>;

  /**
   * Finds a monthly income entry by its ID.
   * @param id The monthly income's ID.
   * @returns The monthly income if found, otherwise null.
   */
  findById(id: string): Promise<MonthlyIncome | null>;

  /**
   * Returns all monthly income entries for a given month.
   * @param monthId The month's ID.
   */
  findByMonthId(monthId: string): Promise<MonthlyIncome[]>;

  /**
   * Returns all monthly income entries belonging to a user.
   * @param userId The user's ID.
   */
  findByUserId(userId: string): Promise<MonthlyIncome[]>;

  /**
   * Returns all monthly income entries linked to a recurring income template.
   * @param recurringIncomeId The recurring income's ID.
   */
  findByRecurringIncomeId(recurringIncomeId: string): Promise<MonthlyIncome[]>;

  /**
   * Finds the monthly income entry for a recurring income in a given month.
   * @param recurringIncomeId The recurring income's ID.
   * @param monthId The month's ID.
   * @returns The monthly income if found, otherwise null.
   */
  findRecurringIncomeEntry(
    recurringIncomeId: string,
    monthId: string,
  ): Promise<MonthlyIncome | null>;

  /**
   * Updates a monthly income entry.
   * @param id The monthly income's ID.
   * @param data Fields to update.
   * @param options Optional Sequelize transaction.
   * @returns The updated monthly income, or null if not found.
   */
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

  /**
   * Deletes a monthly income entry.
   * @param income The monthly income entity to delete.
   */
  delete(income: MonthlyIncome): Promise<void>;

  /**
   * Deletes all monthly income entries linked to a recurring income template.
   * @param recurringIncomeId The recurring income's ID.
   * @returns The number of deleted records.
   */
  deleteByRecurringIncomeId(recurringIncomeId: string): Promise<number>;
}

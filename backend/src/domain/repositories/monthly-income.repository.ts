import type { Transaction } from "sequelize";
import type { MonthlyIncome } from "../entities/monthly-income.entity";
import { User } from "../entities/user.entity";

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
   * @param user The user entity.
   * @returns An array of monthly income entries belonging to the user.
   */
  findByUser(user: User): Promise<MonthlyIncome[]>;

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
   * @param monthlyIncome The monthly income entity to update.
   * @param options Optional Sequelize transaction.
   * @returns The updated monthly income, or null if not found.
   */
  update(
    monthlyIncome: MonthlyIncome,
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

import type { Transaction } from "sequelize";
import type { MonthlyIncome } from "../entities/monthly-income.entity";
import { User } from "../entities/user.entity";
import { Month } from "../entities/month.entity";
import { RecurringIncome } from "../entities/recurring-income.entity";

export interface IMonthlyIncomeRepository {
  /**
   * Creates a new monthly income entry.
   * @param income The monthly income entity to create.
   * @param options Optional Sequelize transaction.
   * @returns The created monthly income.
   */
  create(
    income: MonthlyIncome,
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
   * @param month The month entity.
   * @return An array of monthly income entries belonging to the month.
   */
  findByMonth(month: Month): Promise<MonthlyIncome[]>;

  /**
   * Returns all monthly income entries belonging to a user.
   * @param user The user entity.
   * @returns An array of monthly income entries belonging to the user.
   */
  findByUser(user: User): Promise<MonthlyIncome[]>;

  /**
   * Returns all monthly income entries linked to a recurring income template.
   * @param recurringIncome The recurring income entity.
   * @return An array of monthly income entries linked to the recurring income.
   */
  findByRecurringIncome(
    recurringIncome: RecurringIncome,
  ): Promise<MonthlyIncome[]>;

  /**
   * Finds the monthly income entry for a recurring income in a given month.
   * @param recurringIncome The recurring income entity.
   * @param month The month entity.
   * @returns The monthly income if found, otherwise null.
   */
  findRecurringIncomeEntry(
    recurringIncome: RecurringIncome,
    month: Month,
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
  ): Promise<MonthlyIncome>;

  /**
   * Deletes a monthly income entry.
   * @param income The monthly income entity to delete.
   */
  delete(income: MonthlyIncome): Promise<void>;

  /**
   * Deletes all monthly income entries linked to a recurring income template.
   * @param recurringIncome The recurring income entity.
   * @returns The number of deleted records.
   */
  deleteByRecurringIncome(recurringIncome: RecurringIncome): Promise<number>;
}

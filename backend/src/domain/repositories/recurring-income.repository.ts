import type { RecurringIncome } from "../entities/recurring-income.entity";

export interface IRecurringIncomeRepository {
  /**
   * Creates a new recurring income entry.
   * @param data Recurring income fields excluding generated identifiers, timestamps and validation methods.
   * @returns The created recurring income.
   */
  create(data: RecurringIncome): Promise<RecurringIncome>;

  /**
   * Finds a recurring income entry by its ID.
   * @param id The recurring income's ID.
   * @returns The recurring income if found, otherwise null.
   */
  findById(id: string): Promise<RecurringIncome | null>;

  /**
   * Returns all recurring incomes belonging to a user.
   * @param userId The user's ID.
   * @returns An array of recurring incomes.
   */
  findByUserId(userId: string): Promise<RecurringIncome[]>;

  /**
   * Updates a recurring income entry.
   * @param data The recurring income entity with updated fields.
   * @returns The updated recurring income.
   */
  update(data: RecurringIncome): Promise<RecurringIncome>;

  /**
   * Deletes a recurring income entry.
   * @param income The recurring income entity to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(income: RecurringIncome): Promise<void>;
}

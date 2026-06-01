import type { RecurringIncome } from "../entities/recurring-income.entity";

export interface IRecurringIncomeRepository {
  /**
   * Creates a new recurring income entry.
   * @param data Recurring income fields excluding generated identifiers, timestamps and validation methods.
   * @returns The created recurring income.
   */
  create(
    data: Omit<
      RecurringIncome,
      "id" | "createdAt" | "updatedAt" | "validateBaseFields"
    >,
  ): Promise<RecurringIncome>;

  /**
   * Finds a recurring income entry by its ID.
   * @param id The recurring income's ID.
   * @returns The recurring income if found, otherwise null.
   */
  findById(id: string): Promise<RecurringIncome | null>;

  /**
   * Returns all recurring incomes belonging to a user.
   * @param userId The user's ID.
   */
  findByUserId(userId: string): Promise<RecurringIncome[]>;

  /**
   * Updates a recurring income entry.
   * @param id The recurring income's ID.
   * @param data Fields to update.
   * @returns The updated recurring income, or null if not found.
   */
  update(
    id: string,
    data: Partial<{
      description: string;
      grossIncome: number;
      incomeType: string;
      taxationMode: string;
      taxationProfile: string | null;
      taxationParameters: Record<string, unknown> | null;
      kind: string;
      occurrences: number | null;
      status: string;
    }>,
  ): Promise<RecurringIncome | null>;

  /**
   * Deletes a recurring income entry.
   * @param income The recurring income entity to delete.
   */
  delete(income: RecurringIncome): Promise<void>;
}

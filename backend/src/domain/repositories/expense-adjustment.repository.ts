import type { ExpenseAdjustment } from "../entities/expense-adjustment.entity";

export interface IExpenseAdjustmentRepository {
  /**
   * Creates a new expense adjustment record.
   * @param data Adjustment fields excluding generated identifiers and timestamps.
   * @returns The created expense adjustment.
   */
  create(
    data: Omit<ExpenseAdjustment, "id" | "createdAt" | "updatedAt">,
  ): Promise<ExpenseAdjustment>;

  /**
   * Returns all adjustment records for a given expense.
   * @param expenseId The expense's ID.
   */
  findByExpenseId(expenseId: string): Promise<ExpenseAdjustment[]>;
}

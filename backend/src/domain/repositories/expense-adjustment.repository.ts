import type { ExpenseAdjustment } from "../entities/expense-adjustment.entity";
import { Expense } from "../entities/expense.entity";

export interface IExpenseAdjustmentRepository {
  /**
   * Creates a new expense adjustment record.
   * @param data Adjustment fields excluding generated identifiers and timestamps.
   * @returns The created expense adjustment.
   */
  create(data: ExpenseAdjustment): Promise<ExpenseAdjustment>;

  /**
   * Returns all adjustment records for a given expense.
   * @param expense The expense entity.
   */
  findByExpense(expense: Expense): Promise<ExpenseAdjustment[]>;
}

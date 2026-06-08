import type { ExpenseItem } from "../entities/expense-item.entity";
import { Expense } from "../entities/expense.entity";

export interface IExpenseItemRepository {
  /**
   * Creates a new expense item.
   * @param data Expense item fields excluding generated identifiers and timestamps.
   * @returns The created expense item.
   */
  create(data: ExpenseItem): Promise<ExpenseItem>;

  /**
   * Finds an expense item by its ID.
   * @param id The expense item's ID.
   * @returns The expense item if found, otherwise null.
   */
  findById(id: string): Promise<ExpenseItem | null>;

  /**
   * Returns all items belonging to an expense.
   * @param expense The expense entity.
   * @returns An array of expense items associated with the specified expense.
   */
  findByExpense(expense: Expense): Promise<ExpenseItem[]>;

  /**
   * Updates an expense item.
   * @param expenseItem The expense item entity to update.
   * @returns The updated expense item.
   */
  update(expenseItem: ExpenseItem): Promise<ExpenseItem>;

  /**
   * Deletes an expense item.
   * @param item The expense item entity to delete.
   */
  delete(item: ExpenseItem): Promise<void>;

  /**
   * Calculates the sum of amounts for all items belonging to an expense.
   * @param expense The expense entity.
   * @returns The total amount.
   */
  sumAmountByExpense(expense: Expense): Promise<number>;
}

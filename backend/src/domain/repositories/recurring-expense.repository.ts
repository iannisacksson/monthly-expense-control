import type { Category } from "../entities/category.entity";
import type { RecurringExpense } from "../entities/recurring-expense.entity";
import type { Subcategory } from "../entities/subcategory.entity";
import type { User } from "../entities/user.entity";

export interface IRecurringExpenseRepository {
  /**
   * Creates a new recurring expense entry.
   * @param data Recurring expense fields excluding generated identifiers, timestamps and validation methods.
   * @returns The created recurring expense.
   */
  create(
    data: Omit<
      RecurringExpense,
      "id" | "createdAt" | "updatedAt" | "validateBaseFields"
    >,
  ): Promise<RecurringExpense>;

  /**
   * Finds a recurring expense entry by its ID.
   * @param id The recurring expense's ID.
   * @returns The recurring expense if found, otherwise null.
   */
  findById(id: string): Promise<RecurringExpense | null>;

  /**
   * Returns all recurring expenses belonging to a user.
   * @param userId The user's ID.
   */
  findByUserId(userId: string): Promise<RecurringExpense[]>;

  /**
   * Updates a recurring expense entry.
   * @param id The recurring expense's ID.
   * @param data Fields to update.
   * @returns The updated recurring expense, or null if not found.
   */
  update(
    id: string,
    data: Partial<{
      description: string;
      value: number;
      expenseKind: string;
      plannedAmount: number | null;
      category: Category;
      subcategory: Subcategory | null;
      paidBy: User | null;
      responsibleUser: User | null;
      occurrences: number | null;
      status: string;
    }>,
  ): Promise<RecurringExpense | null>;

  /**
   * Deletes a recurring expense entry.
   * @param expense The recurring expense entity to delete.
   */
  delete(expense: RecurringExpense): Promise<void>;
}

import type { RecurringExpense } from "../entities/recurring-expense.entity";
import { User } from "../entities/user.entity";

export interface IRecurringExpenseRepository {
  /**
   * Creates a new recurring expense entry.
   * @param data Recurring expense fields excluding generated identifiers, timestamps and validation methods.
   * @returns The created recurring expense.
   */
  create(data: RecurringExpense): Promise<RecurringExpense>;

  /**
   * Finds a recurring expense entry by its ID.
   * @param id The recurring expense's ID.
   * @returns The recurring expense if found, otherwise null.
   */
  findById(id: string): Promise<RecurringExpense | null>;

  /**
   * Returns all recurring expenses belonging to a user.
   * @param user The user entity.
   * @returns An array of recurring expenses belonging to the user.
   */
  findByUser(user: User): Promise<RecurringExpense[]>;

  /**
   * Updates a recurring expense entry.
   * @param recurringExpense The recurring expense entity to update.
   * @returns The updated recurring expense.
   */
  update(recurringExpense: RecurringExpense): Promise<RecurringExpense>;

  /**
   * Deletes a recurring expense entry.
   * @param expense The recurring expense entity to delete.
   */
  delete(expense: RecurringExpense): Promise<void>;
}

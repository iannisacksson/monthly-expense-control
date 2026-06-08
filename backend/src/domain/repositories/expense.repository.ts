import type { Category } from "../entities/category.entity";
import type { Expense, ExpenseKindType } from "../entities/expense.entity";
import type { InstallmentGroup } from "../entities/installment-group.entity";
import { Month } from "../entities/month.entity";
import type { RecurringExpense } from "../entities/recurring-expense.entity";
import type { User } from "../entities/user.entity";

export interface IExpenseRepository {
  /**
   * Creates a new expense.
   * @param data Expense fields excluding generated identifiers and timestamps.
   * @returns The created expense.
   */
  create(data: Expense): Promise<Expense>;

  /**
   * Finds an expense by its ID.
   * @param id The expense's ID.
   * @returns The expense if found, otherwise null.
   */
  findById(id: string): Promise<Expense | null>;

  /**
   * Returns all expenses belonging to a month.
   * @param month The month entity.
   */
  findByMonth(month: Month): Promise<Expense[]>;

  /**
   * Returns all expenses of a given kind belonging to a month.
   * @param month The month entity.
   * @param expenseKind The expense kind filter.
   * @return An array of expenses matching the criteria.
   */
  findByMonthAndKind(
    month: Month,
    expenseKind: ExpenseKindType,
  ): Promise<Expense[]>;

  /**
   * Returns expenses matching the given IDs.
   * @param ids Array of expense IDs.
   */
  findByIds(ids: string[]): Promise<Expense[]>;

  /**
   * Returns all expenses under a given category.
   * @param category The category entity.
   * @return An array of expenses under the category.
   */
  findByCategory(category: Category): Promise<Expense[]>;

  /**
   * Returns all expenses belonging to an installment group.
   * @param installmentGroup The installment group entity.
   * @return An array of expenses belonging to the installment group.
   */
  findByInstallmentGroup(
    installmentGroup: InstallmentGroup,
  ): Promise<Expense[]>;

  /**
   * Returns all expenses linked to a recurring expense template.
   * @param recurringExpense The recurring expense entity.
   * @return An array of expenses linked to the recurring expense.
   */
  findByRecurringExpense(
    recurringExpense: RecurringExpense,
  ): Promise<Expense[]>;

  /**
   * Finds the expense entry for a recurring expense in a given month.
   * @param recurringExpenseId The recurring expense's ID.
   * @param monthId The month's ID.
   * @returns The expense if found, otherwise null.
   */
  findRecurringExpenseEntry(
    recurringExpense: RecurringExpense,
    month: Month,
  ): Promise<Expense | null>;

  /**
   * Finds the expense entry for an installment group in a given month.
   * @param installmentGroup The installment group entity.
   * @param month The month entity.
   * @returns The expense if found, otherwise null.
   */
  findInstallmentExpenseEntry(
    installmentGroup: InstallmentGroup,
    month: Month,
  ): Promise<Expense | null>;

  /**
   * Updates an expense.
   * @param expense The expense entity to update.
   * @returns The updated expense.
   */
  update(expense: Expense): Promise<Expense>;

  /**
   * Updates multiple expenses by their IDs.
   * @param ids Array of expense IDs.
   * @param data Fields to update.
   * @returns The number of updated records.
   */
  updateManyByIds(
    ids: string[],
    data: Partial<{
      paidBy: User | null;
      isPaid: boolean;
      paymentDate: Date | null;
    }>,
  ): Promise<number>;

  /**
   * Deletes an expense.
   * @param expense The expense entity to delete.
   */
  delete(expense: Expense): Promise<void>;

  /**
   * Deletes multiple expenses.
   * @param expenses Array of expense entities to delete.
   * @returns The number of deleted records.
   */
  deleteMany(expenses: Expense[]): Promise<number>;

  /**
   * Deletes all expenses belonging to an installment group.
   * @param installmentGroup The installment group entity.
   * @returns The number of deleted records.
   */
  deleteByInstallmentGroup(installmentGroup: InstallmentGroup): Promise<void>;

  /**
   * Deletes all expenses of an installment group on or after a given date.
   * @param installmentGroup The installment group entity.
   * @param expenseDate The lower-bound date (inclusive, ISO string).
   * @returns The number of deleted records.
   */
  deleteByInstallmentGroupFromDate(
    installmentGroup: InstallmentGroup,
    expenseDate: string,
  ): Promise<number>;

  /**
   * Deletes all expenses linked to a recurring expense template.
   * @param recurringExpense The recurring expense entity.
   * @returns The number of deleted records.
   */
  deleteByRecurringExpense(recurringExpense: RecurringExpense): Promise<number>;

  /**
   * Deletes all expenses of a recurring expense template on or after a given date.
   * @param recurringExpense The recurring expense entity.
   * @param expenseDate The lower-bound date (inclusive, ISO string).
   * @returns The number of deleted records.
   */
  deleteByRecurringExpenseFromDate(
    recurringExpense: RecurringExpense,
    expenseDate: string,
  ): Promise<number>;
}

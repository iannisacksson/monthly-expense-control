import type { Category } from "../entities/category.entity";
import type { Expense, ExpenseKindType } from "../entities/expense.entity";
import type { InstallmentGroup } from "../entities/installment-group.entity";
import type { RecurringExpense } from "../entities/recurring-expense.entity";
import type { Subcategory } from "../entities/subcategory.entity";
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
   * @param monthId The month's ID.
   */
  findByMonthId(monthId: string): Promise<Expense[]>;

  /**
   * Returns all expenses of a given kind belonging to a month.
   * @param monthId The month's ID.
   * @param expenseKind The expense kind filter.
   */
  findByMonthIdAndKind(
    monthId: string,
    expenseKind: ExpenseKindType,
  ): Promise<Expense[]>;

  /**
   * Returns expenses matching the given IDs.
   * @param ids Array of expense IDs.
   */
  findByIds(ids: string[]): Promise<Expense[]>;

  /**
   * Returns all expenses under a given category.
   * @param categoryId The category's ID.
   */
  findByCategoryId(categoryId: string): Promise<Expense[]>;

  /**
   * Returns all expenses belonging to an installment group.
   * @param installmentGroupId The installment group's ID.
   */
  findByInstallmentGroupId(installmentGroupId: string): Promise<Expense[]>;

  /**
   * Returns all expenses linked to a recurring expense template.
   * @param recurringExpenseId The recurring expense's ID.
   */
  findByRecurringExpenseId(recurringExpenseId: string): Promise<Expense[]>;

  /**
   * Finds the expense entry for a recurring expense in a given month.
   * @param recurringExpenseId The recurring expense's ID.
   * @param monthId The month's ID.
   * @returns The expense if found, otherwise null.
   */
  findRecurringExpenseEntry(
    recurringExpenseId: string,
    monthId: string,
  ): Promise<Expense | null>;

  /**
   * Finds the expense entry for an installment group in a given month.
   * @param installmentGroupId The installment group's ID.
   * @param monthId The month's ID.
   * @returns The expense if found, otherwise null.
   */
  findInstallmentExpenseEntry(
    installmentGroupId: string,
    monthId: string,
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
   * @param installmentGroupId The installment group's ID.
   * @param expenseDate The lower-bound date (inclusive, ISO string).
   * @returns The number of deleted records.
   */
  deleteByInstallmentGroupIdFromDate(
    installmentGroupId: string,
    expenseDate: string,
  ): Promise<number>;

  /**
   * Deletes all expenses linked to a recurring expense template.
   * @param recurringExpenseId The recurring expense's ID.
   * @returns The number of deleted records.
   */
  deleteByRecurringExpenseId(recurringExpenseId: string): Promise<number>;

  /**
   * Deletes all expenses of a recurring expense template on or after a given date.
   * @param recurringExpenseId The recurring expense's ID.
   * @param expenseDate The lower-bound date (inclusive, ISO string).
   * @returns The number of deleted records.
   */
  deleteByRecurringExpenseIdFromDate(
    recurringExpenseId: string,
    expenseDate: string,
  ): Promise<number>;
}

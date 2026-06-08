import type { BudgetRule } from "../entities/budget-rule.entity";
import { User } from "../entities/user.entity";

export interface IBudgetRuleRepository {
  /**
   * Creates a new budget rule.
   * @param data Budget rule fields excluding generated identifiers, timestamps and validation methods.
   * @returns The created budget rule.
   */
  create(data: BudgetRule): Promise<BudgetRule>;

  /**
   * Finds a budget rule by its ID.
   * @param id The budget rule's ID.
   * @returns The budget rule if found, otherwise null.
   */
  findById(id: string): Promise<BudgetRule | null>;

  /**
   * Returns all budget rules belonging to a user.
   * @param user The user entity.
   * @returns An array of budget rules associated with the specified user.
   */
  findByUser(user: User): Promise<BudgetRule[]>;

  /**
   * Updates a budget rule's name.
   * @param budgetRule The budget rule entity to update.
   * @returns The updated budget rule.
   */
  update(budgetRule: BudgetRule): Promise<BudgetRule>;

  /**
   * Deletes a budget rule.
   * @param rule The budget rule entity to delete.
   */
  delete(rule: BudgetRule): Promise<void>;
}

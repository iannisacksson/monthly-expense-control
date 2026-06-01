import type { BudgetAllocation } from "../entities/budget-allocation.entity";
import type { Category } from "../entities/category.entity";

export interface IBudgetAllocationRepository {
  /**
   * Creates a new budget allocation.
   * @param data Allocation fields excluding generated identifiers, timestamps and validation methods.
   * @returns The created budget allocation.
   */
  create(
    data: Omit<
      BudgetAllocation,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "validatePercentage"
      | "ensureTotalPercentageWithinLimit"
    >,
  ): Promise<BudgetAllocation>;

  /**
   * Finds a budget allocation by its ID.
   * @param id The allocation's ID.
   * @returns The budget allocation if found, otherwise null.
   */
  findById(id: string): Promise<BudgetAllocation | null>;

  /**
   * Returns all allocations for a given budget rule.
   * @param budgetRuleId The budget rule's ID.
   */
  findByBudgetRuleId(budgetRuleId: string): Promise<BudgetAllocation[]>;

  /**
   * Updates a budget allocation.
   * @param id The allocation's ID.
   * @param data Fields to update.
   * @returns The updated allocation, or null if not found.
   */
  update(
    id: string,
    data: Partial<{ category: Category; percentage: number }>,
  ): Promise<BudgetAllocation | null>;

  /**
   * Deletes a budget allocation.
   * @param allocation The allocation entity to delete.
   */
  delete(allocation: BudgetAllocation): Promise<void>;
}

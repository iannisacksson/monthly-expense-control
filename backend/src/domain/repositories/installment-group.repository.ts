import type { Category } from "../entities/category.entity";
import type { InstallmentGroup } from "../entities/installment-group.entity";
import type { Month } from "../entities/month.entity";
import type { Subcategory } from "../entities/subcategory.entity";
import type { User } from "../entities/user.entity";

export interface IInstallmentGroupRepository {
  /**
   * Creates a new installment group.
   * @param data Installment group fields excluding generated identifiers and timestamps.
   * @returns The created installment group.
   */
  create(
    data: Omit<InstallmentGroup, "id" | "createdAt" | "updatedAt">,
  ): Promise<InstallmentGroup>;

  /**
   * Finds an installment group by its ID.
   * @param id The installment group's ID.
   * @returns The installment group if found, otherwise null.
   */
  findById(id: string): Promise<InstallmentGroup | null>;

  /**
   * Returns all installment groups belonging to a user.
   * @param userId The user's ID.
   */
  findByUserId(userId: string): Promise<InstallmentGroup[]>;

  /**
   * Updates an installment group.
   * @param id The installment group's ID.
   * @param data Fields to update.
   * @returns The updated installment group, or null if not found.
   */
  update(
    id: string,
    data: Partial<{
      description: string;
      totalValue: number;
      installments: number;
      startingInstallmentNumber: number;
      category: Category;
      subcategory: Subcategory | null;
      paidBy: User | null;
      responsibleUser: User | null;
      startMonth: Month | null;
    }>,
  ): Promise<InstallmentGroup | null>;

  /**
   * Deletes an installment group.
   * @param group The installment group entity to delete.
   */
  delete(group: InstallmentGroup): Promise<void>;
}

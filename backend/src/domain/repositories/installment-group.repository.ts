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
  create(data: InstallmentGroup): Promise<InstallmentGroup>;

  /**
   * Finds an installment group by its ID.
   * @param id The installment group's ID.
   * @returns The installment group if found, otherwise null.
   */
  findById(id: string): Promise<InstallmentGroup | null>;

  /**
   * Returns all installment groups belonging to a user.
   * @param user The user entity.
   * @returns An array of installment groups belonging to the user.
   */
  findByUser(user: User): Promise<InstallmentGroup[]>;

  /**
   * Updates an installment group.
   * @param installmentGroup The installment group entity to update.
   * @returns The updated installment group.
   */
  update(installmentGroup: InstallmentGroup): Promise<InstallmentGroup>;

  /**
   * Deletes an installment group.
   * @param group The installment group entity to delete.
   */
  delete(group: InstallmentGroup): Promise<void>;
}

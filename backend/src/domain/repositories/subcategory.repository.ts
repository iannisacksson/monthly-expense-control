import type { Subcategory } from "../entities/subcategory.entity";

export interface ISubcategoryRepository {
  /**
   * Creates a new subcategory.
   * @param data Subcategory fields excluding generated identifiers, timestamps and validation methods.
   * @returns The created subcategory.
   */
  create(
    data: Omit<
      Subcategory,
      "id" | "createdAt" | "updatedAt" | "validateName" | "normalizeName"
    >,
  ): Promise<Subcategory>;

  /**
   * Finds a subcategory by its ID.
   * @param id The subcategory's ID.
   * @returns The subcategory if found, otherwise null.
   */
  findById(id: string): Promise<Subcategory | null>;

  /**
   * Returns all subcategories belonging to a given category.
   * @param categoryId The category's ID.
   */
  findByCategoryId(categoryId: string): Promise<Subcategory[]>;

  /**
   * Updates a subcategory's name.
   * @param id The subcategory's ID.
   * @param data Fields to update.
   * @returns The updated subcategory, or null if not found.
   */
  update(
    id: string,
    data: Partial<{ name: string }>,
  ): Promise<Subcategory | null>;

  /**
   * Deletes a subcategory.
   * @param subcategory The subcategory entity to delete.
   */
  delete(subcategory: Subcategory): Promise<void>;
}

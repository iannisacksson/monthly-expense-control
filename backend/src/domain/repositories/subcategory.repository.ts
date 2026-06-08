import { Category } from "../entities/category.entity";
import type { Subcategory } from "../entities/subcategory.entity";

export interface ISubcategoryRepository {
  /**
   * Creates a new subcategory.
   * @param data Subcategory fields excluding generated identifiers, timestamps and validation methods.
   * @returns The created subcategory.
   */
  create(data: Subcategory): Promise<Subcategory>;

  /**
   * Finds a subcategory by its ID.
   * @param id The subcategory's ID.
   * @returns The subcategory if found, otherwise null.
   */
  findById(id: string): Promise<Subcategory | null>;

  /**
   * Returns all subcategories belonging to a given category.
   * @param category The category entity.
   * @return An array of subcategories under the specified category.
   */
  findByCategory(category: Category): Promise<Subcategory[]>;

  /**
   * Updates a subcategory's name.
   * @param subcategory The subcategory entity with updated fields.
   * @returns The updated subcategory.
   */
  update(subcategory: Subcategory): Promise<Subcategory>;

  /**
   * Deletes a subcategory.
   * @param subcategory The subcategory entity to delete.
   */
  delete(subcategory: Subcategory): Promise<void>;
}

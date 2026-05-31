import { Category } from "../entities/category.entity";

export interface ICategoryRepository {
  /**
   * Creates a new category.
   * @param category The category to create.
   * @return The created category.
   */
  create(category: Category): Promise<Category>;

  /**
   * Finds a category by its ID.
   * @param id The ID of the category.
   * @return The category if found, otherwise null.
   */
  findById(id: string): Promise<Category | null>;

  /**
   * Finds all categories belonging to a specific user.
   * @param userId The ID of the user to find categories for.
   * @return An array of categories belonging to the user.
   */
  findByUserId(userId: string): Promise<Category[]>;

  /**
   * Finds all categories.
   * @return An array of all categories.
   */
  findAll(): Promise<Category[]>;

  /**
   * Updates a category by its ID.
   * @param id The ID of the category to update.
   * @param data The data to update the category with.
   * @return The updated category if found, otherwise null.
   */
  update(data: Category): Promise<Category>;

  /**
   * Deletes a category.
   * @param category The category to delete.
   * @return A promise that resolves when the category is deleted.
   */
  delete(category: Category): Promise<void>;
}

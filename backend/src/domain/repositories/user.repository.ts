import type { User } from "../entities/user.entity";

export interface IUserRepository {
  /**
   * Creates a new user.
   * @param data The user's name, email and hashed password.
   * @returns The created user.
   */
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User>;

  /**
   * Finds a user by their ID.
   * @param id The user's ID.
   * @returns The user if found, otherwise null.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email address.
   * @param email The user's email address.
   * @returns The user if found, otherwise null.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Updates a user's profile information.
   * @param id The user's ID.
   * @param data Fields to update.
   * @returns The updated user, or null if not found.
   */
  update(
    id: string,
    data: Partial<{ name: string; email: string; passwordHash: string }>,
  ): Promise<User | null>;

  /**
   * Deletes a user.
   * @param user The user to delete.
   */
  delete(user: User): Promise<void>;
}

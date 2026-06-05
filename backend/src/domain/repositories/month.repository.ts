import type { BudgetRule } from "../entities/budget-rule.entity";
import type { Month, MonthStatus } from "../entities/month.entity";

export interface IMonthRepository {
  /**
   * Creates a new month entry for a user.
   * @param data Month fields excluding generated identifiers and timestamps.
   * @returns The created month.
   */
  create(data: Month): Promise<Month>;

  /**
   * Finds a month by its ID.
   * @param id The month's ID.
   * @returns The month if found, otherwise null.
   */
  findById(id: string): Promise<Month | null>;

  /**
   * Returns all months belonging to a user.
   * @param userId The user's ID.
   */
  findByUserId(userId: string): Promise<Month[]>;

  /**
   * Finds a month by user and calendar period.
   * @param userId The user's ID.
   * @param year The calendar year.
   * @param month The calendar month (1–12).
   * @returns The month if found, otherwise null.
   */
  findByUserAndPeriod(
    userId: string,
    year: number,
    month: number,
  ): Promise<Month | null>;

  /**
   * Updates a month's status or budget rule.
   * @param month The month entity to update.
   * @returns The updated month.
   */
  update(month: Month): Promise<Month>;

  /**
   * Deletes a month.
   * @param month The month entity to delete.
   */
  delete(month: Month): Promise<void>;
}

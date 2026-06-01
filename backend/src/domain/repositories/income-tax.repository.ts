import type { Transaction } from "sequelize";
import type { IncomeTax } from "../entities/income-tax.entity";

export interface IIncomeTaxRepository {
  /**
   * Creates a single income tax entry.
   * @param data Tax fields.
   * @param options Optional Sequelize transaction.
   * @returns The created income tax.
   */
  create(
    data: {
      monthlyIncomeId: string;
      taxType: string;
      value: number;
      isAuto: boolean;
    },
    options?: { transaction?: Transaction },
  ): Promise<IncomeTax>;

  /**
   * Creates multiple income tax entries in bulk.
   * @param data Array of tax fields.
   * @param options Optional Sequelize transaction.
   * @returns The created income taxes.
   */
  createMany(
    data: Array<{
      monthlyIncomeId: string;
      taxType: string;
      value: number;
      isAuto: boolean;
    }>,
    options?: { transaction?: Transaction },
  ): Promise<IncomeTax[]>;

  /**
   * Finds an income tax entry by its ID.
   * @param id The income tax's ID.
   * @returns The income tax if found, otherwise null.
   */
  findById(id: string): Promise<IncomeTax | null>;

  /**
   * Returns all income taxes associated with a monthly income entry.
   * @param monthlyIncomeId The monthly income's ID.
   */
  findByMonthlyIncomeId(monthlyIncomeId: string): Promise<IncomeTax[]>;

  /**
   * Deletes all automatically-generated taxes for a monthly income entry.
   * @param monthlyIncomeId The monthly income's ID.
   * @param options Optional Sequelize transaction.
   * @returns The number of deleted records.
   */
  deleteAutoByMonthlyIncomeId(
    monthlyIncomeId: string,
    options?: { transaction?: Transaction },
  ): Promise<number>;

  /**
   * Updates an income tax entry.
   * @param id The income tax's ID.
   * @param data Fields to update.
   * @returns The updated income tax, or null if not found.
   */
  update(
    id: string,
    data: Partial<{ taxType: string; value: number; isAuto: boolean }>,
  ): Promise<IncomeTax | null>;

  /**
   * Deletes an income tax entry.
   * @param tax The income tax entity to delete.
   */
  delete(tax: IncomeTax): Promise<void>;
}

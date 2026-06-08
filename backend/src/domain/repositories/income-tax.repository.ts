import type { Transaction } from "sequelize";
import type { IncomeTax } from "../entities/income-tax.entity";
import { MonthlyIncome } from "../entities/monthly-income.entity";

export interface IIncomeTaxRepository {
  /**
   * Creates a single income tax entry.
   * @param data Tax fields.
   * @param options Optional Sequelize transaction.
   * @returns The created income tax.
   */
  create(
    data: IncomeTax,
    options?: { transaction?: Transaction },
  ): Promise<IncomeTax>;

  /**
   * Creates multiple income tax entries in bulk.
   * @param data Array of tax fields.
   * @param options Optional Sequelize transaction.
   * @returns The created income taxes.
   */
  createMany(
    data: Array<IncomeTax>,
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
   * @param monthlyIncome The monthly income entity.
   * @returns An array of income taxes for the given monthly income.
   */
  findByMonthlyIncome(monthlyIncome: MonthlyIncome): Promise<IncomeTax[]>;

  /**
   * Deletes all automatically-generated taxes for a monthly income entry.
   * @param monthlyIncome The monthly income entity.
   * @param options Optional Sequelize transaction.
   * @returns The number of deleted records.
   */
  deleteAutoByMonthlyIncome(
    monthlyIncome: MonthlyIncome,
    options?: { transaction?: Transaction },
  ): Promise<number>;

  /**
   * Updates an income tax entry.
   * @param incomeTax The income tax entity to update.
   * @returns The updated income tax.
   */
  update(incomeTax: IncomeTax): Promise<IncomeTax>;

  /**
   * Deletes an income tax entry.
   * @param tax The income tax entity to delete.
   */
  delete(tax: IncomeTax): Promise<void>;
}

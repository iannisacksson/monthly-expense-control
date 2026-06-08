import type { Transaction } from "sequelize";
import { sequelize } from "../../../database/connection";
import type { MonthlyIncome } from "../../../domain/entities/monthly-income.entity";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { IncomeTaxEntity } from "../../../domain/entities/income-tax.entity";

export class UpdateMonthlyIncomeUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly incomeTaxRepository: IIncomeTaxRepository,
    private readonly runInTransaction: <T>(
      fn: (t: Transaction) => Promise<T>,
    ) => Promise<T> = (fn) => sequelize.transaction(fn),
  ) {}

  async execute(monthlyIncome: MonthlyIncome, requestingUserId: string) {
    const existing = await this.monthlyIncomeRepository.findById(
      monthlyIncome.id,
    );
    if (!existing) throw new NotFoundError("Monthly income not found");
    if (existing.user.id !== requestingUserId) throw new ForbiddenError();

    if (
      monthlyIncome.grossIncome !== undefined &&
      monthlyIncome.grossIncome <= 0
    ) {
      throw new Error("Income amount must be greater than zero");
    }
    if (monthlyIncome.notes !== undefined && monthlyIncome.notes.length > 255) {
      throw new Error("Income notes must be at most 255 characters");
    }

    const resolvedGrossIncome =
      monthlyIncome.grossIncome ?? existing.grossIncome;
    monthlyIncome.normalizeTaxation();

    return this.runInTransaction(async (transaction) => {
      const updated = await this.monthlyIncomeRepository.update(
        {
          ...existing,
          grossIncome: monthlyIncome.grossIncome,
          incomeType: monthlyIncome.incomeType,
          notes: monthlyIncome.notes,
          taxationMode: monthlyIncome.taxationMode,
          taxationProfile: monthlyIncome.taxationProfile,
          taxationParameters: monthlyIncome.taxationParameters,
        },
        { transaction },
      );

      if (!updated) throw new NotFoundError("Monthly income not found");

      await this.incomeTaxRepository.deleteAutoByMonthlyIncomeId(
        monthlyIncome.id,
        {
          transaction,
        },
      );

      const automaticTaxes = existing.calculateAutomaticTaxes();
      if (automaticTaxes.length > 0) {
        await this.incomeTaxRepository.createMany(
          automaticTaxes.map(
            (tax) =>
              new IncomeTaxEntity({
                monthlyIncome,
                taxType: tax.tax_type,
                value: tax.value,
                isAuto: true,
              }),
          ),
          { transaction },
        );
      }

      return updated;
    });
  }
}

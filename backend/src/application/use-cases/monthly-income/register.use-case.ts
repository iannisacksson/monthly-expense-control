import type { Transaction } from "sequelize";
import { sequelize } from "../../../database/connection";
import { MonthlyIncome } from "../../../domain/entities/monthly-income.entity";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import type { IMonthRepository } from "../../../domain/repositories/month.repository";
import type { IUserRepository } from "../../../domain/repositories/user.repository";
import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import { IncomeTaxationService } from "../../../services/income-taxation.service";
import { BadRequestError, ForbiddenError } from "../../../utils/errors";
import { IncomeTaxEntity } from "../../../domain/entities/income-tax.entity";

export class RegisterMonthlyIncomeUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly userRepository: IUserRepository,
    private readonly incomeTaxRepository: IIncomeTaxRepository,
    private readonly runInTransaction: <T>(
      fn: (t: Transaction) => Promise<T>,
    ) => Promise<T> = (fn) => sequelize.transaction(fn),
  ) {}

  async execute(entity: MonthlyIncome, requestingUserId: string) {
    entity.validateGrossIncome();
    entity.validateNotes();
    entity.normalizeTaxation();

    const user = await this.userRepository.findById(requestingUserId);
    if (!user) throw new BadRequestError("User not found");

    const month = await this.monthRepository.findById(entity.month.id);
    if (!month) throw new BadRequestError("Month not found");
    if (month.user.id !== requestingUserId) throw new ForbiddenError();

    return this.runInTransaction(async (transaction) => {
      const income = await this.monthlyIncomeRepository.create(entity, {
        transaction,
      });

      const automaticTaxes = entity.calculateAutomaticTaxes();
      if (automaticTaxes.length > 0) {
        await this.incomeTaxRepository.createMany(
          automaticTaxes.map(
            (tax) =>
              new IncomeTaxEntity({
                monthlyIncome: income,
                taxType: tax.tax_type,
                value: tax.value,
                isAuto: true as const,
              }),
          ),
          { transaction },
        );
      }

      return income;
    });
  }
}

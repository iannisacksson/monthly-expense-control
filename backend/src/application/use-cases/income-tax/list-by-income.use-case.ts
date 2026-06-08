import { MonthlyIncome } from "../../../domain/entities/monthly-income.entity";
import { User } from "../../../domain/entities/user.entity";
import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { ForbiddenError } from "../../../utils/errors";

export class ListIncomeTaxesByIncomeUseCase {
  constructor(
    private readonly incomeTaxRepository: IIncomeTaxRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(monthlyIncome: MonthlyIncome, requestingUser: User) {
    const income = await this.monthlyIncomeRepository.findById(
      monthlyIncome.id,
    );
    if (!income || income.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    return this.incomeTaxRepository.findByMonthlyIncome(monthlyIncome);
  }
}

import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { IncomeTaxRepository } from "../../../repositories/income-tax.repository";
import { MonthlyIncomeRepository } from "../../../repositories/monthly-income.repository";
import { ForbiddenError } from "../../../utils/errors";

export class ListIncomeTaxesByIncomeUseCase {
  constructor(
    private readonly incomeTaxRepository: IIncomeTaxRepository = new IncomeTaxRepository(),
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository = new MonthlyIncomeRepository(),
  ) {}

  async execute(monthlyIncomeId: string, requestingUserId: string) {
    const income = await this.monthlyIncomeRepository.findById(monthlyIncomeId);
    if (!income || income.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return this.incomeTaxRepository.findByMonthlyIncomeId(monthlyIncomeId);
  }
}

import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { ForbiddenError } from "../../../utils/errors";

export class ListIncomeTaxesByIncomeUseCase {
  constructor(
    private readonly incomeTaxRepository: IIncomeTaxRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(monthlyIncomeId: string, requestingUserId: string) {
    const income = await this.monthlyIncomeRepository.findById(monthlyIncomeId);
    if (!income || income.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return this.incomeTaxRepository.findByMonthlyIncomeId(monthlyIncomeId);
  }
}

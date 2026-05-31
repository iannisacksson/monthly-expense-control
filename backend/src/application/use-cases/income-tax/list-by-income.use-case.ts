import { IncomeTaxRepository } from "../../../repositories/income-tax.repository"
import { MonthlyIncomeRepository } from "../../../repositories/monthly-income.repository"
import { ForbiddenError } from "../../../utils/errors"

export class ListIncomeTaxesByIncomeUseCase {
  constructor(
    private readonly incomeTaxRepository: IncomeTaxRepository = new IncomeTaxRepository(),
    private readonly monthlyIncomeRepository: MonthlyIncomeRepository = new MonthlyIncomeRepository(),
  ) {}

  async execute(monthlyIncomeId: string, requestingUserId: string) {
    const income = await this.monthlyIncomeRepository.findById(monthlyIncomeId);
    if (!income || income.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError();
    }

    return this.incomeTaxRepository.findByMonthlyIncomeId(monthlyIncomeId);
  }
}
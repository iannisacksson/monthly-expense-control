import { IncomeTaxRepository } from "../../../repositories/income-tax.repository"
import { MonthlyIncomeRepository } from "../../../repositories/monthly-income.repository"
import { ForbiddenError } from "../../../utils/errors"

export class GetIncomeTaxByIdUseCase {
  constructor(
    private readonly incomeTaxRepository: Pick<IncomeTaxRepository, "findById"> = new IncomeTaxRepository(),
    private readonly monthlyIncomeRepository: Pick<MonthlyIncomeRepository, "findById"> = new MonthlyIncomeRepository(),
  ) {}

  async execute(id: string, requestingUserId: string) {
    const tax = await this.incomeTaxRepository.findById(id)
    if (!tax) {
      throw new Error("Income tax not found")
    }

    const income = await this.monthlyIncomeRepository.findById(
      tax.getDataValue("monthly_income_id") as string,
    )
    if (!income || income.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    return tax
  }
}
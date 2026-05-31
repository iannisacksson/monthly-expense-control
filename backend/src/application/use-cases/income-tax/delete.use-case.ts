import { IncomeTaxRepository } from "../../../repositories/income-tax.repository"
import { MonthlyIncomeRepository } from "../../../repositories/monthly-income.repository"
import { ForbiddenError } from "../../../utils/errors"

export class DeleteIncomeTaxUseCase {
  constructor(
    private readonly incomeTaxRepository: IncomeTaxRepository = new IncomeTaxRepository(),
    private readonly monthlyIncomeRepository: MonthlyIncomeRepository = new MonthlyIncomeRepository(),
  ) {}

  async execute(id: string, requestingUserId: string) {
    const existingTax = await this.incomeTaxRepository.findById(id);
    if (!existingTax) {
      throw new Error("Income tax not found");
    }

    const income = await this.monthlyIncomeRepository.findById(
      existingTax.getDataValue("monthly_income_id") as string,
    );
    if (!income || income.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError();
    }

    if (existingTax.getDataValue("is_auto") as boolean) {
      throw new Error("Automatic income taxes cannot be deleted manually");
    }

    const tax = await this.incomeTaxRepository.delete(id);
    if (!tax) {
      throw new Error("Income tax not found");
    }

    return tax;
  }
}
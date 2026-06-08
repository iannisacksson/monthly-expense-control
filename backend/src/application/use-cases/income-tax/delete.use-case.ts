import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class DeleteIncomeTaxUseCase {
  constructor(
    private readonly incomeTaxRepository: IIncomeTaxRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(id: string, requestingUserId: string) {
    const existingTax = await this.incomeTaxRepository.findById(id);
    if (!existingTax) {
      throw new NotFoundError("Income tax not found");
    }

    const income = await this.monthlyIncomeRepository.findById(
      existingTax.monthlyIncome.id,
    );
    if (!income || income.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    if (existingTax.isAuto) {
      throw new Error("Automatic income taxes cannot be deleted manually");
    }

    await this.incomeTaxRepository.delete(existingTax);
    return existingTax;
  }
}

import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class GetIncomeTaxByIdUseCase {
  constructor(
    private readonly incomeTaxRepository: IIncomeTaxRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(id: string, requestingUserId: string) {
    const tax = await this.incomeTaxRepository.findById(id);
    if (!tax) {
      throw new NotFoundError("Income tax not found");
    }

    const income = await this.monthlyIncomeRepository.findById(
      tax.monthlyIncome.id,
    );
    if (!income || income.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return tax;
  }
}

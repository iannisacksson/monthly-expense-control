import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class GetMonthlyIncomeByIdUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(id: string, requestingUserId: string) {
    const income = await this.monthlyIncomeRepository.findById(id);
    if (!income) throw new NotFoundError("Monthly income not found");
    if (income.userId !== requestingUserId) throw new ForbiddenError();
    return income;
  }
}

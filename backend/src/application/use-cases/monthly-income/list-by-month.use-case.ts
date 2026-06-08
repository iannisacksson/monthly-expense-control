import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import type { IMonthRepository } from "../../../domain/repositories/month.repository";
import { ForbiddenError } from "../../../utils/errors";
import { Month } from "../../../domain/entities/month.entity";
import { MonthlyIncome } from "../../../domain/entities/monthly-income.entity";
import { User } from "../../../domain/entities/user.entity";

export class ListMonthlyIncomesByMonthUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(month: Month, requestingUser: User): Promise<MonthlyIncome[]> {
    const foundMonth = await this.monthRepository.findById(month.id);
    if (!foundMonth || foundMonth.user.id !== requestingUser.id)
      throw new ForbiddenError();
    return this.monthlyIncomeRepository.findByMonth(foundMonth);
  }
}

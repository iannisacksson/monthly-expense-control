import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import type { IMonthRepository } from "../../../domain/repositories/month.repository";
import { ForbiddenError } from "../../../utils/errors";

export class ListMonthlyIncomesByMonthUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(monthId: string, requestingUserId: string) {
    const month = await this.monthRepository.findById(monthId);
    if (!month || month.user.id !== requestingUserId)
      throw new ForbiddenError();
    return this.monthlyIncomeRepository.findByMonthId(monthId);
  }
}

import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { MonthRepository } from "../../../repositories/month.repository";
import { ForbiddenError } from "../../../utils/errors";

export class ListMonthlyIncomesByMonthUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly monthRepository: MonthRepository = new MonthRepository(),
  ) {}

  async execute(monthId: string, requestingUserId: string) {
    const month = await this.monthRepository.findById(monthId);
    if (!month || month.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError();
    return this.monthlyIncomeRepository.findByMonthId(monthId);
  }
}

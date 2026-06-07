import { RecurringIncome } from "../../../domain/entities/recurring-income.entity";
import { User } from "../../../domain/entities/user.entity";
import { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { IRecurringIncomeRepository } from "../../../domain/repositories/recurring-income.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class DeleteRecurringIncomeUseCase {
  constructor(
    private readonly recurringIncomeRepository: IRecurringIncomeRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(recurringIncome: RecurringIncome, requestingUser: User) {
    const recurringIncomeFound = await this.recurringIncomeRepository.findById(
      recurringIncome.id,
    );
    if (!recurringIncomeFound) {
      throw new NotFoundError("Recurring income not found");
    }
    if (recurringIncomeFound.user.id !== requestingUser.id)
      throw new ForbiddenError();

    await this.monthlyIncomeRepository.deleteByRecurringIncomeId(
      recurringIncomeFound.id,
    );
    await this.recurringIncomeRepository.delete(recurringIncomeFound);
    return recurringIncomeFound;
  }
}

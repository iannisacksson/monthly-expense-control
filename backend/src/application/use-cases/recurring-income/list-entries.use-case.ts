import { RecurringIncome } from "../../../domain/entities/recurring-income.entity";
import { User } from "../../../domain/entities/user.entity";
import { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { IRecurringIncomeRepository } from "../../../domain/repositories/recurring-income.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class GetRecurringIncomeByIdUseCase {
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
    if (recurringIncomeFound.user.id !== requestingUser.id) {
      throw new ForbiddenError("Recurring income not found");
    }
    const monthlyIncomes =
      await this.monthlyIncomeRepository.findByRecurringIncomeId(
        recurringIncomeFound.id,
      );

    return monthlyIncomes;
  }
}

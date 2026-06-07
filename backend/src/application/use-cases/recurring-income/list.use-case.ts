import { RecurringIncome } from "../../../domain/entities/recurring-income.entity";
import { User } from "../../../domain/entities/user.entity";
import { IRecurringIncomeRepository } from "../../../domain/repositories/recurring-income.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class GetRecurringIncomeByIdUseCase {
  constructor(
    private readonly recurringIncomeRepository: IRecurringIncomeRepository,
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

    return recurringIncomeFound;
  }
}

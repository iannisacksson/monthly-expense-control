import { RecurringExpense } from "../../../domain/entities/recurring-expense.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { IRecurringExpenseRepository } from "../../../domain/repositories/recurring-expense.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class FindRecurringExpenseByIdUseCase {
  constructor(
    private readonly recurringExpenseRepository: IRecurringExpenseRepository,
  ) {}

  async execute(
    recurringExpense: RecurringExpense,
    requestingUser: UserEntity,
  ): Promise<RecurringExpense> {
    const recurringExpenseFound =
      await this.recurringExpenseRepository.findById(recurringExpense.id);
    if (!recurringExpenseFound) {
      throw new NotFoundError("Recurring expense not found");
    }
    if (recurringExpenseFound.user.id !== requestingUser.id) {
      throw new ForbiddenError("Recurring expense not found");
    }

    return recurringExpenseFound;
  }
}

import { RecurringExpense } from "../../../domain/entities/recurring-expense.entity";
import { User } from "../../../domain/entities/user.entity";
import { IRecurringExpenseRepository } from "../../../domain/repositories/recurring-expense.repository";

export class ListRecurringExpensesUseCase {
  constructor(
    private readonly recurringExpenseRepository: IRecurringExpenseRepository,
  ) {}

  async execute(requestingUser: User): Promise<RecurringExpense[]> {
    const recurringExpenseFound =
      await this.recurringExpenseRepository.findByUser(requestingUser);

    return recurringExpenseFound;
  }
}

import { Expense } from "../../../domain/entities/expense.entity";
import { RecurringExpense } from "../../../domain/entities/recurring-expense.entity";
import { User } from "../../../domain/entities/user.entity";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IRecurringExpenseRepository } from "../../../domain/repositories/recurring-expense.repository";
import { NotFoundError } from "../../../utils/errors";

export class ListRecurringExpenseEntriesUseCase {
  constructor(
    private readonly recurringExpenseRepository: IRecurringExpenseRepository,
    private readonly expenseRepository: IExpenseRepository,
  ) {}

  async execute(
    recurringExpense: RecurringExpense,
    requestingUser: User,
  ): Promise<Expense[]> {
    const recurringExpenseFound =
      await this.recurringExpenseRepository.findById(recurringExpense.id);

    if (!recurringExpenseFound) {
      throw new NotFoundError("Recurring expense not found");
    }

    if (recurringExpenseFound.user.id !== requestingUser.id) {
      throw new NotFoundError("Recurring expense not found");
    }

    const expenses = await this.expenseRepository.findByRecurringExpenseId(
      recurringExpenseFound.id,
    );

    return expenses;
  }
}

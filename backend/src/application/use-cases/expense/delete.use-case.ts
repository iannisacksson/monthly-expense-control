import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { Expense } from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { User } from "../../../domain/entities/user.entity";

export class DeleteExpenseUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(expense: Expense, requestingUser: User): Promise<void> {
    const existingExpense = await this.expenseRepository.findById(expense.id);
    if (!existingExpense) {
      throw new NotFoundError("Expense not found");
    }

    const month = await this.monthRepository.findById(expense.month.id);
    if (!month) {
      throw new NotFoundError("Month not found");
    }
    if (month.user.id !== requestingUser.id) throw new ForbiddenError();

    await this.expenseRepository.delete(expense);
  }
}

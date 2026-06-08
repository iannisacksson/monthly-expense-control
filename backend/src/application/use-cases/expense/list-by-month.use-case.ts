import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { Expense } from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { User } from "../../../domain/entities/user.entity";
import { Month } from "../../../domain/entities/month.entity";

export class ListExpenseByMonthUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(user: User, month: Month): Promise<Expense[]> {
    const monthFound = await this.monthRepository.findById(month.id);
    if (!monthFound) {
      throw new NotFoundError("Month not found");
    }

    if (monthFound.user.id !== user.id) {
      throw new ForbiddenError();
    }

    return this.expenseRepository.findByMonth(monthFound);
  }
}

import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { Expense } from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { User } from "../../../domain/entities/user.entity";
import { Month } from "../../../domain/entities/month.entity";

export class BulkMarkExpensesPaidUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(
    expenses: Expense[],
    month: Month,
    requestingUser: User,
    paymentDate?: Date,
  ): Promise<void> {
    if (!month.id) {
      throw new Error("month_id is required");
    }

    if (!Array.isArray(expenses) || expenses.length === 0) {
      throw new Error("expense_ids must contain at least one expense");
    }

    const monthFound = await this.monthRepository.findById(month.id);

    if (!monthFound) {
      throw new NotFoundError("Month not found");
    }

    if (monthFound.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    const expensesFound = await this.expenseRepository.findByIds(
      expenses.map((e) => e.id),
    );
    if (expensesFound.length !== expenses.length) {
      throw new Error("One or more expenses were not found");
    }

    const allBelongToMonth = expensesFound.every(
      (expense) => expense.month.id === monthFound.id,
    );
    if (!allBelongToMonth) {
      throw new Error("All selected expenses must belong to the same month");
    }

    await this.expenseRepository.updateManyByIds(
      expensesFound.map((e) => e.id),
      {
        isPaid: true,
        paidBy: requestingUser,
        paymentDate: paymentDate ?? new Date(),
      },
    );
  }
}

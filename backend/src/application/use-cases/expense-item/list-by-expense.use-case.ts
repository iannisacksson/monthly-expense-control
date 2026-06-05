import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import {
  Expense,
  ExpenseKindType,
} from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { User } from "../../../domain/entities/user.entity";
import { IExpenseAdjustmentRepository } from "../../../domain/repositories/expense-adjustment.repository";
import { ExpenseAdjustment } from "../../../domain/entities/expense-adjustment.entity";

export class ListExpenseItemsUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly expenseAdjustmentRepository: IExpenseAdjustmentRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(
    expense: Expense,
    requestingUser: User,
  ): Promise<ExpenseAdjustment[]> {
    const expenseFound = await this.expenseRepository.findById(expense.id);

    if (!expenseFound) {
      throw new NotFoundError("Expense not found");
    }

    if (expenseFound.expenseKind !== ExpenseKindType.ENVELOPE) {
      throw new Error("Expense items are only available for envelope expenses");
    }

    const month = await this.monthRepository.findById(expenseFound.month.id);

    if (!month || month.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    const expenseAdjustments =
      await this.expenseAdjustmentRepository.findByExpense(expense);

    return expenseAdjustments;
  }
}

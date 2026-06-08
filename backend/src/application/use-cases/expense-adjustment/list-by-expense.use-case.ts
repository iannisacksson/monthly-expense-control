import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import {
  Expense,
  ExpenseKindType,
} from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { User } from "../../../domain/entities/user.entity";
import { ExpenseItem } from "../../../domain/entities/expense-item.entity";
import { IExpenseItemRepository } from "../../../domain/repositories/expense-item.repository";

export class ListExpenseItemsUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly expenseItemRepository: IExpenseItemRepository,
  ) {}

  async execute(
    expense: Expense,
    requestingUser: User,
  ): Promise<ExpenseItem[]> {
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

    const expenseItems =
      await this.expenseItemRepository.findByExpense(expenseFound);

    return expenseItems;
  }
}

import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { ExpenseKindType } from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { User } from "../../../domain/entities/user.entity";
import {
  ExpenseItem,
  ExpenseItemEntity,
} from "../../../domain/entities/expense-item.entity";
import { IExpenseItemRepository } from "../../../domain/repositories/expense-item.repository";
import { IExpenseAdjustmentRepository } from "../../../domain/repositories/expense-adjustment.repository";
import { ExpenseAdjustmentEntity } from "../../../domain/entities/expense-adjustment.entity";

export class CreateExpenseItemUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly expenseItemRepository: IExpenseItemRepository,
    private readonly expenseAdjustmentRepository: IExpenseAdjustmentRepository,
  ) {}

  async execute(
    expenseItem: ExpenseItem,
    requestingUser: User,
  ): Promise<ExpenseItem> {
    const expenseFound = await this.expenseRepository.findById(
      expenseItem.expense.id,
    );

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

    const newExpenseItem = new ExpenseItemEntity({
      expense: expenseFound,
      description: expenseItem.description,
      amount: expenseItem.amount,
    });

    const item = await this.expenseItemRepository.create(newExpenseItem);

    const previousValue = Number(expenseFound.value);
    const nextValue =
      await this.expenseItemRepository.sumAmountByExpense(expenseFound);

    if (previousValue === nextValue) {
      return item;
    }

    expenseFound.value = nextValue;

    const updatedExpense = await this.expenseRepository.update(expenseFound);

    const adjustment = new ExpenseAdjustmentEntity({
      expense: updatedExpense,
      changedBy: requestingUser,
      previousValue,
      newValue: nextValue,
    });

    await this.expenseAdjustmentRepository.create(adjustment);

    return item;
  }
}

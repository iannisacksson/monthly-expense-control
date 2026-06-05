import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { ExpenseKindType } from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { User } from "../../../domain/entities/user.entity";
import { ExpenseItem } from "../../../domain/entities/expense-item.entity";
import { IExpenseItemRepository } from "../../../domain/repositories/expense-item.repository";
import { IExpenseAdjustmentRepository } from "../../../domain/repositories/expense-adjustment.repository";
import { ExpenseAdjustmentEntity } from "../../../domain/entities/expense-adjustment.entity";

export class UpdateExpenseItemUseCase {
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
    const existingItem = await this.expenseItemRepository.findById(
      expenseItem.id,
    );
    if (!existingItem) {
      throw new NotFoundError("Expense item not found");
    }

    const expenseId = existingItem.expense.id;
    const expenseFound = await this.expenseRepository.findById(expenseId);

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

    existingItem.description =
      expenseItem.description ?? existingItem.description;
    existingItem.amount = expenseItem.amount ?? existingItem.amount;

    const updatedItem = await this.expenseItemRepository.update(existingItem);

    const previousValue = Number(expenseFound.value);
    const nextValue = await this.expenseItemRepository.sumAmountByExpenseId(
      expenseFound.id,
    );

    if (previousValue === nextValue) {
      return updatedItem;
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

    return updatedItem;
  }
}

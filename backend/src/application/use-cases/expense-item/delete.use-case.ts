import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { ExpenseKindType } from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { User } from "../../../domain/entities/user.entity";
import { ExpenseItem } from "../../../domain/entities/expense-item.entity";
import { IExpenseItemRepository } from "../../../domain/repositories/expense-item.repository";
import { IExpenseAdjustmentRepository } from "../../../domain/repositories/expense-adjustment.repository";
import { ExpenseAdjustmentEntity } from "../../../domain/entities/expense-adjustment.entity";

export class DeleteExpenseItemUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly expenseItemRepository: IExpenseItemRepository,
    private readonly expenseAdjustmentRepository: IExpenseAdjustmentRepository,
  ) {}

  async execute(expenseItem: ExpenseItem, requestingUser: User): Promise<void> {
    const existingItem = await this.expenseItemRepository.findById(
      expenseItem.id,
    );
    if (!existingItem) {
      throw new NotFoundError("Expense item not found");
    }

    const expense = await this.expenseRepository.findById(
      existingItem.expense.id,
    );

    if (!expense) {
      throw new NotFoundError("Expense not found");
    }

    if (expense.expenseKind !== ExpenseKindType.ENVELOPE) {
      throw new Error("Expense items are only available for envelope expenses");
    }

    const month = await this.monthRepository.findById(expense.month.id);

    if (!month || month.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    if (month.isClosed()) {
      throw new Error("Cannot delete expense item from a closed month");
    }

    await this.expenseItemRepository.delete(expenseItem);

    const previousValue = Number(expense.value);
    const nextValue = await this.expenseItemRepository.sumAmountByExpenseId(
      expense.id,
    );

    if (previousValue === nextValue) {
      return;
    }

    expense.value = nextValue;

    const updatedExpense = await this.expenseRepository.update(expense);

    const adjustment = new ExpenseAdjustmentEntity({
      expense: updatedExpense,
      changedBy: requestingUser,
      previousValue,
      newValue: nextValue,
    });

    await this.expenseAdjustmentRepository.create(adjustment);

    return;
  }
}

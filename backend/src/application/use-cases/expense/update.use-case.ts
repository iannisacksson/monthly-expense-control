import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import {
  Expense,
  ExpenseKindType,
} from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { User } from "../../../domain/entities/user.entity";
import { IExpenseAdjustmentRepository } from "../../../domain/repositories/expense-adjustment.repository";
import { ExpenseAdjustmentEntity } from "../../../domain/entities/expense-adjustment.entity";

export class FindExpenseByIdUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly expenseAdjustmentRepository: IExpenseAdjustmentRepository,
  ) {}

  async execute(expense: Expense, requestingUser: User): Promise<Expense> {
    const existingExpense = await this.expenseRepository.findById(expense.id);
    if (!existingExpense) {
      throw new NotFoundError("Expense not found");
    }

    if (
      expense.value !== undefined &&
      existingExpense.expenseKind !== ExpenseKindType.ENVELOPE &&
      expense.value <= 0
    ) {
      throw new Error("Expense amount must be greater than zero");
    }

    const month = await this.monthRepository.findById(expense.month.id);
    if (!month) {
      throw new NotFoundError("Month not found");
    }
    if (month.isClosed()) {
      throw new Error("Closed months do not allow this expense operation");
    }

    if (month.user.id !== requestingUser.id) throw new ForbiddenError();

    const nextCategoryId = expense.category?.id ?? existingExpense.category.id;
    const nextSubcategoryId =
      expense.subcategory?.id ?? existingExpense.subcategory?.id;

    await this.validateCategoryAndSubcategory({
      userId: requestingUser.id,
      categoryId: nextCategoryId,
      subcategoryId: nextSubcategoryId,
    });

    existingExpense.plannedAmount =
      expense.plannedAmount ?? existingExpense.plannedAmount;

    if (existingExpense.isPaid === true && !existingExpense.paymentDate) {
      existingExpense.paymentDate = new Date();
    }

    if (existingExpense.isPaid === false) {
      existingExpense.paymentDate = undefined;
      existingExpense.paidBy = undefined;
    }

    const updatedExpense = await this.expenseRepository.update(existingExpense);

    const previousValue = existingExpense.value;
    const shouldCreateAdjustment =
      existingExpense.expenseKind === ExpenseKindType.ENVELOPE &&
      expense.value !== undefined &&
      previousValue !== expense.value;

    if (shouldCreateAdjustment) {
      await this.expenseAdjustmentRepository.create(
        new ExpenseAdjustmentEntity({
          expense: updatedExpense,
          changedBy: requestingUser,
          previousValue: previousValue,
          newValue: expense.value as number,
        }),
      );
    }

    return updatedExpense;
  }

  private async validateCategoryAndSubcategory(params: {
    userId?: string;
    categoryId: string;
    subcategoryId?: string;
  }) {
    const category = await this.categoryRepository.findById(params.categoryId);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const categoryUserId = category.user?.id ?? null;
    const isSameOwner = !!params.userId && categoryUserId === params.userId;

    if (!isSameOwner) {
      throw new Error("Category must belong to the same owner as the expense");
    }

    if (params.subcategoryId) {
      const subcategory = await this.subcategoryRepository.findById(
        params.subcategoryId,
      );
      if (!subcategory) {
        throw new NotFoundError("Subcategory not found");
      }

      if (subcategory.category?.id !== params.categoryId) {
        throw new ForbiddenError(
          "Subcategory must belong to the selected category",
        );
      }
    }
  }
}

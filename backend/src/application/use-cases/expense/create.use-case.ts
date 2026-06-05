import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import {
  Expense,
  ExpenseKindType,
} from "../../../domain/entities/expense.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { Month } from "../../../domain/entities/month.entity";

export class CreateExpenseUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly subcategoryRepository: ISubcategoryRepository,
  ) {}

  async execute(expense: Expense): Promise<Expense> {
    const resolvedValue =
      expense.expenseKind === ExpenseKindType.ENVELOPE ? 0 : expense.value;

    if (
      resolvedValue === undefined ||
      (expense.expenseKind !== ExpenseKindType.ENVELOPE && resolvedValue <= 0)
    ) {
      throw new Error("Expense amount must be greater than zero");
    }

    const plannedAmount = this.validatePlannedAmount(expense);

    const month = await this.monthRepository.findById(expense.month.id);
    if (!month) {
      throw new NotFoundError("Month not found");
    }
    if (month.isClosed()) {
      throw new Error("Closed months do not allow this expense operation");
    }
    const monthUserId = month.user?.id;
    const ownerUserId = monthUserId ?? undefined;

    if (!ownerUserId) {
      throw new Error(
        "Expense must belong to the owner user of the selected month",
      );
    }

    await this.validateCategoryAndSubcategory({
      userId: ownerUserId,
      categoryId: expense.category?.id,
      subcategoryId: expense.subcategory?.id,
    });

    const expenseDate = expense.expenseDate ?? this.getMonthDate(month);

    return this.expenseRepository.create({
      ...expense,
      value: resolvedValue,
      plannedAmount,
      expenseDate,
    });
  }

  private validatePlannedAmount(expense: Expense) {
    if (expense.expenseKind === ExpenseKindType.ENVELOPE) {
      if (
        expense.plannedAmount === undefined ||
        expense.plannedAmount === null ||
        expense.plannedAmount <= 0
      ) {
        throw new Error(
          "Envelope expenses must define a planned amount greater than zero",
        );
      }

      return expense.plannedAmount;
    }

    if (
      expense.plannedAmount !== undefined &&
      expense.plannedAmount !== null &&
      expense.plannedAmount <= 0
    ) {
      throw new Error("Planned amount must be greater than zero when provided");
    }

    return expense.plannedAmount ?? null;
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

  private getMonthDate(month: Month): string {
    const year = month.year;
    const monthNumber = month.month;
    return `${year}-${String(monthNumber).padStart(2, "0")}-01`;
  }
}

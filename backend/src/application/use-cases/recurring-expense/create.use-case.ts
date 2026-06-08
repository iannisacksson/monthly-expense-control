import { ExpenseEntity } from "../../../domain/entities/expense.entity";
import { Month } from "../../../domain/entities/month.entity";
import {
  RecurringExpense,
  RecurringExpenseEntity,
} from "../../../domain/entities/recurring-expense.entity";
import { User } from "../../../domain/entities/user.entity";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IRecurringExpenseRepository } from "../../../domain/repositories/recurring-expense.repository";
import { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { isMonthWithinRecurringRange } from "../../../utils/month-period";

export class CreateRecurringExpenseUseCase {
  constructor(
    private readonly recurringExpenseRepository: IRecurringExpenseRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly userRepository: IUserRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly subcategoryRepository: ISubcategoryRepository,
  ) {}

  async execute(
    recurringExpense: RecurringExpense,
    requestingUser: User,
  ): Promise<RecurringExpense> {
    recurringExpense.validateBaseFields();

    const startMonth = await this.monthRepository.findById(
      recurringExpense.startMonth?.id,
    );

    if (!startMonth) {
      throw new NotFoundError("Start month not found");
    }

    const monthUserId = startMonth.user?.id;
    if (monthUserId !== requestingUser.id) {
      throw new ForbiddenError();
    }

    const user = await this.userRepository.findById(requestingUser.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.validateCategoryAndSubcategory({
      userId: requestingUser.id,
      categoryId: recurringExpense.category?.id,
      subcategoryId: recurringExpense.subcategory?.id,
    });

    const newRecurringExpense = new RecurringExpenseEntity({
      ...recurringExpense,
      user,
      startMonth,
    });

    const createdRecurringExpense =
      await this.recurringExpenseRepository.create(newRecurringExpense);

    if (createdRecurringExpense.status === "active") {
      await this.syncRecurringExpenseToOwnerMonths(createdRecurringExpense);
    }

    return createdRecurringExpense;
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

  private async syncRecurringExpenseToOwnerMonths(
    recurringExpense: RecurringExpense,
  ) {
    const ownerMonths = await this.monthRepository.findByUser(
      recurringExpense.user,
    );

    const eligibleMonths = ownerMonths
      .filter((month) =>
        this.isMonthWithinRecurringRange(
          recurringExpense.startMonth,
          month,
          recurringExpense.occurrences,
        ),
      )
      .map((month) => month);

    await this.generateRecurringExpenses(recurringExpense, eligibleMonths);
  }

  private isMonthWithinRecurringRange(
    startMonth: Month,
    targetMonth: Month,
    occurrences?: number | null,
  ) {
    return isMonthWithinRecurringRange(
      {
        year: startMonth.year,
        month: startMonth.month,
      },
      {
        year: targetMonth.year,
        month: targetMonth.month,
      },
      occurrences,
    );
  }

  private async generateRecurringExpenses(
    recurringExpense: RecurringExpense,
    months: Month[],
  ) {
    for (const month of months) {
      const existingExpense =
        await this.expenseRepository.findRecurringExpenseEntry(
          recurringExpense,
          month,
        );

      if (existingExpense) {
        continue;
      }

      const expense = new ExpenseEntity({
        category: recurringExpense.category,
        subcategory: recurringExpense.subcategory,
        paidBy: recurringExpense.paidBy,
        responsibleUser: recurringExpense.responsibleUser,
        recurringExpense,
        expenseKind: recurringExpense.expenseKind,
        plannedAmount: recurringExpense.plannedAmount ?? undefined,
        description: recurringExpense.description,
        value: recurringExpense.value,
        expenseDate: new Date(this.getMonthDate(month)),
        month,
      });

      await this.expenseRepository.create(expense);
    }
  }

  private getMonthDate(month: Month): string {
    const year = month.year;
    const monthNumber = month.month;
    return `${year}-${String(monthNumber).padStart(2, "0")}-01`;
  }
}

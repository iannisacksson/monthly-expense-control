import { Category } from "../../../domain/entities/category.entity";
import {
  Expense,
  ExpenseEntity,
} from "../../../domain/entities/expense.entity";
import { Month } from "../../../domain/entities/month.entity";
import {
  RecurringExpense,
  RecurringExpenseStatus,
} from "../../../domain/entities/recurring-expense.entity";
import { Subcategory } from "../../../domain/entities/subcategory.entity";
import { User } from "../../../domain/entities/user.entity";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IRecurringExpenseRepository } from "../../../domain/repositories/recurring-expense.repository";
import { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import {
  getMonthDistance,
  isMonthWithinRecurringRange,
} from "../../../utils/month-period";
import { Scope } from "../../../utils/scope";

export class UpdateRecurringExpenseUseCase {
  constructor(
    private readonly recurringExpenseRepository: IRecurringExpenseRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly subcategoryRepository: ISubcategoryRepository,
  ) {}

  async execute(
    recurringExpense: RecurringExpense,
    requestingUser: User,
    scope: Scope = Scope.WHOLE_SERIES,
  ): Promise<RecurringExpense | Expense> {
    const existingRecurringExpense =
      await this.recurringExpenseRepository.findById(recurringExpense.id);

    if (!existingRecurringExpense) {
      throw new NotFoundError("Recurring expense not found");
    }
    if (existingRecurringExpense.user.id !== requestingUser.id)
      throw new ForbiddenError();

    if (scope === Scope.WHOLE_SERIES) {
      return this.updateWholeSeries(
        recurringExpense.id,
        existingRecurringExpense,
        recurringExpense,
      );
    }

    const { distance, effectiveDate } = await this.getEffectiveMonthContext(
      existingRecurringExpense.startMonth.id,
      recurringExpense.startMonth.id,
    );
    const existingOccurrences = existingRecurringExpense.occurrences;

    if (existingOccurrences != null && distance >= existingOccurrences) {
      throw new Error("Effective month is outside the recurring expense range");
    }

    if (scope === Scope.SINGLE_OCCURRENCE) {
      const occurrence = await this.expenseRepository.findRecurringExpenseEntry(
        recurringExpense,
        recurringExpense.startMonth,
      );
      if (!occurrence) {
        throw new NotFoundError(
          "Recurring expense occurrence not found for the selected month",
        );
      }

      const nextCategory = recurringExpense.category ?? occurrence.category;
      const nextSubcategory =
        recurringExpense.subcategory ?? occurrence.subcategory;

      await this.validateCategoryAndSubcategory(
        existingRecurringExpense.user,
        nextCategory,
        nextSubcategory,
      );

      Object.assign(occurrence, {
        description: recurringExpense.description ?? occurrence.description,
        value: recurringExpense.value ?? occurrence.value,
        expenseKind: recurringExpense.expenseKind ?? occurrence.expenseKind,
        plannedAmount:
          recurringExpense.plannedAmount !== undefined
            ? recurringExpense.plannedAmount
            : occurrence.plannedAmount,
        category: recurringExpense.category ?? occurrence.category,
        subcategory:
          recurringExpense.subcategory !== undefined
            ? recurringExpense.subcategory
            : occurrence.subcategory,
        paidBy:
          recurringExpense.paidBy !== undefined
            ? recurringExpense.paidBy
            : occurrence.paidBy,
        responsibleUser:
          recurringExpense.responsibleUser !== undefined
            ? recurringExpense.responsibleUser
            : occurrence.responsibleUser,
      });

      return this.expenseRepository.update(occurrence);
    }

    if (distance === 0) {
      return this.updateWholeSeries(
        recurringExpense.id,
        existingRecurringExpense,
        recurringExpense,
      );
    }

    Object.assign(existingRecurringExpense, {
      description:
        recurringExpense.description ?? existingRecurringExpense.description,
      value: recurringExpense.value ?? existingRecurringExpense.value,
      expenseKind:
        recurringExpense.expenseKind ?? existingRecurringExpense.expenseKind,
      plannedAmount:
        recurringExpense.plannedAmount !== undefined
          ? recurringExpense.plannedAmount
          : existingRecurringExpense.plannedAmount,
      category: recurringExpense.category ?? existingRecurringExpense.category,
      subcategory:
        recurringExpense.subcategory !== undefined
          ? recurringExpense.subcategory
          : existingRecurringExpense.subcategory,
      paidBy:
        recurringExpense.paidBy !== undefined
          ? recurringExpense.paidBy
          : existingRecurringExpense.paidBy,
      responsibleUser:
        recurringExpense.responsibleUser !== undefined
          ? recurringExpense.responsibleUser
          : existingRecurringExpense.responsibleUser,
      occurrences:
        recurringExpense.occurrences ??
        existingRecurringExpense.occurrences ??
        null,
      status: recurringExpense.status ?? existingRecurringExpense.status,
    });

    existingRecurringExpense.validateBaseFields();

    await this.validateCategoryAndSubcategory(
      existingRecurringExpense.user,
      existingRecurringExpense.category,
      existingRecurringExpense.subcategory,
    );

    await this.expenseRepository.deleteByRecurringExpenseFromDate(
      existingRecurringExpense,
      effectiveDate,
    );
    await this.recurringExpenseRepository.update(existingRecurringExpense);

    const newRecurringExpense = await this.recurringExpenseRepository.create({
      ...existingRecurringExpense,
      startMonth: recurringExpense.startMonth,
    });

    if (newRecurringExpense.status === RecurringExpenseStatus.ACTIVE) {
      await this.syncRecurringExpenseToOwnerMonths(newRecurringExpense);
    }

    return newRecurringExpense;
  }

  private async updateWholeSeries(
    id: string,
    existingRecurringExpense: RecurringExpense,
    data: RecurringExpense,
  ) {
    Object.assign(existingRecurringExpense, {
      description: data.description ?? existingRecurringExpense.description,
      value: data.value ?? existingRecurringExpense.value,
      expenseKind: data.expenseKind ?? existingRecurringExpense.expenseKind,
      plannedAmount:
        data.plannedAmount !== undefined
          ? data.plannedAmount
          : existingRecurringExpense.plannedAmount,
      category: data.category ?? existingRecurringExpense.category,
      subcategory:
        data.subcategory !== undefined
          ? data.subcategory
          : existingRecurringExpense.subcategory,
      paidBy:
        data.paidBy !== undefined
          ? data.paidBy
          : existingRecurringExpense.paidBy,
      responsibleUser:
        data.responsibleUser !== undefined
          ? data.responsibleUser
          : existingRecurringExpense.responsibleUser,
      occurrences:
        data.occurrences ?? existingRecurringExpense.occurrences ?? null,
      status: data.status ?? existingRecurringExpense.status,
    });

    existingRecurringExpense.validateBaseFields();

    await this.validateCategoryAndSubcategory(
      existingRecurringExpense.user,
      existingRecurringExpense.category,
      existingRecurringExpense.subcategory,
    );

    const recurringExpense = await this.recurringExpenseRepository.update(
      existingRecurringExpense,
    );

    await this.expenseRepository.deleteByRecurringExpense(
      existingRecurringExpense,
    );

    if (recurringExpense.status === RecurringExpenseStatus.ACTIVE) {
      await this.syncRecurringExpenseToOwnerMonths(recurringExpense);
    }

    return recurringExpense;
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

  private async validateCategoryAndSubcategory(
    user: User,
    category: Category,
    subcategory?: Subcategory,
  ) {
    const categoryFound = await this.categoryRepository.findById(category.id);
    if (!categoryFound) {
      throw new NotFoundError("Category not found");
    }

    const categoryUserId = categoryFound.user?.id ?? null;
    const isSameOwner = !!user.id && categoryUserId === user.id;

    if (!isSameOwner) {
      throw new Error("Category must belong to the same owner as the expense");
    }

    if (subcategory) {
      const subcategoryFound = await this.subcategoryRepository.findById(
        subcategory.id,
      );
      if (!subcategoryFound) {
        throw new NotFoundError("Subcategory not found");
      }

      if (subcategoryFound.category?.id !== categoryFound.id) {
        throw new ForbiddenError(
          "Subcategory must belong to the selected category",
        );
      }
    }
  }

  private async getEffectiveMonthContext(
    startMonthId: string,
    effectiveMonthId?: string,
  ) {
    if (!effectiveMonthId) {
      throw new Error("effective_month_id is required for this scope");
    }

    const startMonth = await this.findMonthByIdOrThrow(startMonthId);
    const effectiveMonth = await this.findMonthByIdOrThrow(effectiveMonthId);
    const distance = this.getMonthDistance(startMonth, effectiveMonth);

    if (distance < 0) {
      throw new Error("Effective month must be on or after the start month");
    }

    return {
      startMonth,
      effectiveMonth,
      distance,
      effectiveDate: this.getMonthDate(effectiveMonth),
    };
  }

  private async findMonthByIdOrThrow(id: string): Promise<Month> {
    const month = await this.monthRepository.findById(id);
    if (!month) {
      throw new NotFoundError("Month not found");
    }
    return month;
  }

  private getMonthDistance(startMonth: Month, targetMonth: Month) {
    return getMonthDistance(
      {
        year: startMonth.year,
        month: startMonth.month,
      },
      {
        year: targetMonth.year,
        month: targetMonth.month,
      },
    );
  }
}

import {
  Expense,
  ExpenseEntity,
} from "../../../domain/entities/expense.entity";
import { Month } from "../../../domain/entities/month.entity";
import {
  RecurringExpense,
  RecurringExpenseStatus,
} from "../../../domain/entities/recurring-expense.entity";
import { User } from "../../../domain/entities/user.entity";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IRecurringExpenseRepository } from "../../../domain/repositories/recurring-expense.repository";
import {
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} from "../../../utils/errors";
import { getMonthDistance } from "../../../utils/month-period";

export class RestoreRecurringExpenseOccurrenceUseCase {
  constructor(
    private readonly recurringExpenseRepository: IRecurringExpenseRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(
    recurringExpense: RecurringExpense,
    month: Month,
    requestingUser: User,
  ): Promise<RecurringExpense | Expense> {
    const recurringExpenseFound =
      await this.recurringExpenseRepository.findById(recurringExpense.id);
    if (!recurringExpenseFound) {
      throw new NotFoundError("Recurring expense not found");
    }
    if (recurringExpenseFound.user.id !== requestingUser.id)
      throw new ForbiddenError();

    if (recurringExpenseFound.status !== RecurringExpenseStatus.ACTIVE) {
      throw new UnprocessableEntityError(
        "Only active recurring expenses can restore occurrences",
      );
    }

    const startMonthId = recurringExpenseFound.startMonth.id;
    const { distance } = await this.getEffectiveMonthContext(
      startMonthId,
      month.id,
    );
    const occurrences = recurringExpenseFound.occurrences ?? null;

    if (occurrences != null && distance >= occurrences) {
      throw new UnprocessableEntityError(
        "Selected month is outside the recurring expense range",
      );
    }

    const existingExpense =
      await this.expenseRepository.findRecurringExpenseEntry(
        recurringExpenseFound.id,
        month.id,
      );

    if (existingExpense) {
      return existingExpense;
    }

    const expense = new ExpenseEntity({
      month,
      category: recurringExpenseFound.category,
      subcategory: recurringExpenseFound.subcategory,
      paidBy: recurringExpenseFound.paidBy,
      responsibleUser: recurringExpenseFound.responsibleUser,
      recurringExpense: recurringExpenseFound,
      expenseKind: recurringExpenseFound.expenseKind,
      plannedAmount: recurringExpenseFound.plannedAmount ?? undefined,
      description: recurringExpenseFound.description,
      value: recurringExpenseFound.value,
      expenseDate: new Date(this.getMonthDate(month)),
    });

    return this.expenseRepository.create(expense);
  }

  private getMonthDate(month: Month): string {
    const year = month.year;
    const monthNumber = month.month;
    return `${year}-${String(monthNumber).padStart(2, "0")}-01`;
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

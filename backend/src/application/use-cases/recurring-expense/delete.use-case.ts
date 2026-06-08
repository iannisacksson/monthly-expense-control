import { Month } from "../../../domain/entities/month.entity";
import { RecurringExpense } from "../../../domain/entities/recurring-expense.entity";
import { User } from "../../../domain/entities/user.entity";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IRecurringExpenseRepository } from "../../../domain/repositories/recurring-expense.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { getMonthDistance } from "../../../utils/month-period";
import { Scope } from "../../../utils/scope";

export class DeleteRecurringExpenseUseCase {
  constructor(
    private readonly recurringExpenseRepository: IRecurringExpenseRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(
    recurringExpense: RecurringExpense,
    requestingUser: User,
    scope: Scope = Scope.WHOLE_SERIES,
  ): Promise<void> {
    const recurringExpenseFound =
      await this.recurringExpenseRepository.findById(recurringExpense.id);

    if (!recurringExpenseFound) {
      throw new NotFoundError("Recurring expense not found");
    }

    if (requestingUser.id && recurringExpense.user.id !== requestingUser.id)
      throw new ForbiddenError();

    if (scope === Scope.WHOLE_SERIES) {
      await this.expenseRepository.deleteByRecurringExpenseId(
        recurringExpense.id,
      );
      await this.recurringExpenseRepository.delete(recurringExpenseFound);
      return;
    }

    const { distance, effectiveDate } = await this.getEffectiveMonthContext(
      recurringExpenseFound.startMonth.id,
      recurringExpense.startMonth.id,
    );
    const existingOccurrences = recurringExpenseFound.occurrences ?? null;

    if (existingOccurrences != null && distance >= existingOccurrences) {
      throw new Error("Effective month is outside the recurring expense range");
    }

    if (scope === Scope.SINGLE_OCCURRENCE) {
      const deletedOccurrence =
        await this.expenseRepository.findRecurringExpenseEntry(
          recurringExpenseFound.id,
          recurringExpenseFound.startMonth.id,
        );
      if (!deletedOccurrence) {
        throw new NotFoundError(
          "Recurring expense occurrence not found for the selected month",
        );
      }

      await this.expenseRepository.delete(deletedOccurrence);
      return;
    }

    if (distance === 0) {
      await this.expenseRepository.deleteByRecurringExpenseId(
        recurringExpense.id,
      );
      await this.recurringExpenseRepository.delete(recurringExpense);
      return;
    }

    await this.expenseRepository.deleteByRecurringExpenseIdFromDate(
      recurringExpenseFound.id,
      effectiveDate,
    );
    recurringExpenseFound.occurrences = distance;
    await this.recurringExpenseRepository.update(recurringExpenseFound);
    await this.recurringExpenseRepository.findById(recurringExpenseFound.id);
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

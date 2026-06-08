import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import {
  Expense,
  ExpenseEntity,
  ExpenseKindType,
} from "../../../domain/entities/expense.entity";
import {
  InstallmentGroup,
  InstallmentGroupEntity,
} from "../../../domain/entities/installment-group.entity";
import { Month } from "../../../domain/entities/month.entity";
import { User } from "../../../domain/entities/user.entity";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IInstallmentGroupRepository } from "../../../domain/repositories/installment-group.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";

export class RestoreInstallmentOccurrenceUseCase {
  constructor(
    private readonly installmentGroupRepository: IInstallmentGroupRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(
    installmentGroup: InstallmentGroup,
    month: Month,
    requestingUser: User,
  ): Promise<Expense> {
    const group = await this.installmentGroupRepository.findById(
      installmentGroup.id,
    );
    if (!group) {
      throw new NotFoundError("Installment group not found");
    }
    if (group.user.id !== requestingUser.id) throw new ForbiddenError();

    const startMonthId = group.startMonth.id;
    const { distance } = await this.getEffectiveMonthContext(
      startMonthId,
      month.id,
    );
    const startingInstallmentNumber = group.startingInstallmentNumber;
    const installments = group.installments;
    const installmentNumber = startingInstallmentNumber + distance;

    if (installmentNumber > installments) {
      throw new Error("Selected month is outside the installment range");
    }

    return this.createInstallmentExpenseEntry(group, month, installmentNumber);
  }

  private async getEffectiveMonthContext(
    startMonthId: string,
    effectiveMonthId: string,
  ) {
    const startMonth = await this.findMonthByIdOrThrow(startMonthId);
    const effectiveMonth = await this.findMonthByIdOrThrow(effectiveMonthId);
    const distance = this.getMonthDistance(startMonth, effectiveMonth);

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
    const distance =
      (targetMonth.year - startMonth.year) * 12 +
      (targetMonth.month - startMonth.month);

    if (distance < 0) {
      throw new Error("Effective month must be on or after the start month");
    }

    return distance;
  }

  private getMonthDate(month: Month): string {
    return `${month.year}-${String(month.month).padStart(2, "0")}-01`;
  }

  private async createInstallmentExpenseEntry(
    group: InstallmentGroup,
    month: Month,
    installmentNumber: number,
  ): Promise<Expense> {
    const existingExpense =
      await this.expenseRepository.findInstallmentExpenseEntry(group, month);

    if (existingExpense) return existingExpense;

    return this.expenseRepository.create(
      new ExpenseEntity({
        month,
        category: group.category,
        subcategory: group.subcategory,
        paidBy: group.paidBy,
        responsibleUser: group.responsibleUser,
        installmentGroup: group,
        expenseKind: ExpenseKindType.STANDARD,
        isPaid: false,
        description: `${group.description} (${installmentNumber}/${group.installments})`,
        value: Number((group.totalValue / group.installments).toFixed(2)),
        expenseDate: new Date(this.getMonthDate(month)),
      }),
    );
  }
}

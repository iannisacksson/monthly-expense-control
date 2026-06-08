import { User } from "../../../domain/entities/user.entity";
import {
  InstallmentGroup,
  InstallmentGroupScope,
} from "../../../domain/entities/installment-group.entity";
import { IInstallmentGroupRepository } from "../../../domain/repositories/installment-group.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { Month } from "../../../domain/entities/month.entity";

export class DeleteInstallmentGroupUseCase {
  constructor(
    private readonly installmentGroupRepository: IInstallmentGroupRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
  ) {}

  async execute(
    installmentGroup: InstallmentGroup,
    requestingUser: User,
    effectiveMonth: Month,
    scope: InstallmentGroupScope = InstallmentGroupScope.WHOLE_SERIES,
  ): Promise<void> {
    const existingGroup = await this.installmentGroupRepository.findById(
      installmentGroup.id,
    );
    if (!existingGroup) {
      throw new NotFoundError("Installment group not found");
    }
    if (requestingUser.id && existingGroup.user.id !== requestingUser.id)
      throw new ForbiddenError();

    if (scope === InstallmentGroupScope.WHOLE_SERIES) {
      await this.expenseRepository.deleteByInstallmentGroup(existingGroup);

      await this.installmentGroupRepository.delete(existingGroup);

      return;
    }

    const startMonthId = existingGroup.startMonth.id;
    const { distance, effectiveDate } = await this.getEffectiveMonthContext(
      startMonthId,
      effectiveMonth.id,
    );
    const installments = existingGroup.installments;
    const effectiveInstallmentNumber =
      existingGroup.startingInstallmentNumber + distance;

    if (effectiveInstallmentNumber > installments) {
      throw new Error("Effective month is outside the installment range");
    }

    if (scope === InstallmentGroupScope.SINGLE_OCCURRENCE) {
      const deletedOccurrence =
        await this.expenseRepository.findInstallmentExpenseEntry(
          installmentGroup,
          effectiveMonth,
        );
      if (!deletedOccurrence) {
        throw new NotFoundError(
          "Installment occurrence not found for the selected month",
        );
      }

      await this.expenseRepository.delete(deletedOccurrence);
      return;
    }

    if (distance === 0) {
      await this.expenseRepository.deleteByInstallmentGroup(existingGroup);
      await this.installmentGroupRepository.delete(existingGroup);
      return;
    }

    const currentInstallmentValue =
      Number(existingGroup.totalValue) / installments;

    await this.expenseRepository.deleteByInstallmentGroupFromDate(
      installmentGroup,
      effectiveDate,
    );
    existingGroup.installments = effectiveInstallmentNumber - 1;
    existingGroup.totalValue = Number(
      (currentInstallmentValue * (effectiveInstallmentNumber - 1)).toFixed(2),
    );
    const updatedGroup =
      await this.installmentGroupRepository.update(existingGroup);

    if (!updatedGroup) {
      throw new Error("Installment group not found");
    }

    return;
  }

  private async getEffectiveMonthContext(
    startMonthId: string,
    effectiveMonthId: string,
  ) {
    if (!effectiveMonthId) {
      throw new Error("effective_month_id is required for this scope");
    }

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

  private async findMonthByIdOrThrow(id: string) {
    const month = await this.monthRepository.findById(id);
    if (!month) {
      throw new NotFoundError("Month not found");
    }
    return month;
  }

  private getMonthDistance(startMonth: Month, targetMonth: Month) {
    const startYear = startMonth.year;
    const startMonthNumber = startMonth.month;
    const targetYear = targetMonth.year;
    const targetMonthNumber = targetMonth.month;
    const distance =
      (targetYear - startYear) * 12 + (targetMonthNumber - startMonthNumber);

    if (distance < 0) {
      throw new Error("Effective month must be on or after the start month");
    }

    return distance;
  }

  private getMonthDate(month: Month) {
    const year = month.year;
    const monthNumber = month.month;
    return `${year}-${String(monthNumber).padStart(2, "0")}-01`;
  }
}

import { IncomeTaxEntity } from "../../../domain/entities/income-tax.entity";
import { Month } from "../../../domain/entities/month.entity";
import { MonthlyIncomeEntity } from "../../../domain/entities/monthly-income.entity";
import {
  RecurringIncome,
  RecurringIncomeStatus,
} from "../../../domain/entities/recurring-income.entity";
import { User } from "../../../domain/entities/user.entity";
import { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { IRecurringIncomeRepository } from "../../../domain/repositories/recurring-income.repository";
import { isMonthWithinRecurringRange } from "../../../domain/value-objects/month-period";
import { IncomeTaxationService } from "../../../services/income-taxation.service";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class UpdateRecurringIncomeUseCase {
  constructor(
    private readonly recurringIncomeRepository: IRecurringIncomeRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly incomeTaxationService: IncomeTaxationService,
    private readonly incomeTaxRepository: IIncomeTaxRepository,
  ) {}

  async execute(recurringIncome: RecurringIncome, requestingUser: User) {
    const existingRecurringIncome =
      await this.recurringIncomeRepository.findById(recurringIncome.id);
    if (!existingRecurringIncome) {
      throw new NotFoundError("Recurring income not found");
    }
    if (existingRecurringIncome.user.id !== requestingUser.id)
      throw new ForbiddenError();

    Object.assign(existingRecurringIncome, {
      description:
        recurringIncome.description ?? existingRecurringIncome.description,
      grossIncome:
        recurringIncome.grossIncome ?? existingRecurringIncome.grossIncome,
      incomeType:
        recurringIncome.incomeType ?? existingRecurringIncome.incomeType,
      kind: recurringIncome.kind ?? existingRecurringIncome.kind,
      occurrences:
        recurringIncome.occurrences ?? existingRecurringIncome.occurrences,
      status: recurringIncome.status ?? existingRecurringIncome.status,
      taxationMode:
        recurringIncome.taxationMode ?? existingRecurringIncome.taxationMode,
      taxationProfile:
        recurringIncome.taxationProfile ??
        existingRecurringIncome.taxationProfile,
      taxationParameters:
        recurringIncome.taxationParameters ??
        existingRecurringIncome.taxationParameters,
    });

    existingRecurringIncome.validateBaseFields();
    existingRecurringIncome.normalizeTaxation();

    await this.recurringIncomeRepository.update(existingRecurringIncome);

    await this.monthlyIncomeRepository.deleteByRecurringIncome(
      existingRecurringIncome,
    );

    if (existingRecurringIncome.status === RecurringIncomeStatus.ACTIVE) {
      await this.syncRecurringIncomeToOwnerMonths(
        existingRecurringIncome,
        existingRecurringIncome.startMonth,
        existingRecurringIncome.user,
      );
    }

    return existingRecurringIncome;
  }

  private async syncRecurringIncomeToOwnerMonths(
    recurringIncome: RecurringIncome,
    startMonth: Month,
    user: User,
  ) {
    const ownerMonths = await this.monthRepository.findByUser(user);
    const eligibleMonths = ownerMonths
      .filter((month) =>
        this.isMonthWithinRecurringRange(
          startMonth,
          month,
          recurringIncome.occurrences,
        ),
      )
      .map((month) => month);

    await this.generateMonthlyIncomes(recurringIncome, user, eligibleMonths);
  }

  private isMonthWithinRecurringRange(
    startMonth: any,
    targetMonth: any,
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

  private async generateMonthlyIncomes(
    recurringIncome: RecurringIncome,
    user: User,
    months: Month[],
  ) {
    for (const month of months) {
      const existingIncome =
        await this.monthlyIncomeRepository.findRecurringIncomeEntry(
          recurringIncome,
          month,
        );

      if (existingIncome) {
        continue;
      }

      const monthlyIncome = new MonthlyIncomeEntity({
        user,
        month,
        recurringIncome,
        grossIncome: recurringIncome.grossIncome,
        incomeType: recurringIncome.incomeType,
        taxationMode: recurringIncome.taxationMode,
        taxationProfile: recurringIncome.taxationProfile,
        taxationParameters: recurringIncome.taxationParameters,
        notes: recurringIncome.description,
      });

      const income = await this.monthlyIncomeRepository.create(monthlyIncome);

      const automaticTaxes = this.incomeTaxationService.calculateAutomaticTaxes(
        recurringIncome.grossIncome,
        {
          mode: recurringIncome.taxationMode,
          profile: recurringIncome.taxationProfile,
          parameters: recurringIncome.taxationParameters,
        },
      );

      if (automaticTaxes.length > 0) {
        await this.incomeTaxRepository.createMany(
          automaticTaxes.map(
            (tax) =>
              new IncomeTaxEntity({
                monthlyIncome: income,
                taxType: tax.tax_type,
                value: tax.value,
                isAuto: true,
              }),
          ),
        );
      }
    }
  }
}

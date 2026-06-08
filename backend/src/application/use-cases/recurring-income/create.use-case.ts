import { IncomeTaxEntity } from "../../../domain/entities/income-tax.entity";
import { Month } from "../../../domain/entities/month.entity";
import { MonthlyIncomeEntity } from "../../../domain/entities/monthly-income.entity";
import {
  RecurringIncome,
  RecurringIncomeEntity,
  RecurringIncomeStatus,
} from "../../../domain/entities/recurring-income.entity";
import { User } from "../../../domain/entities/user.entity";
import { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { IRecurringIncomeRepository } from "../../../domain/repositories/recurring-income.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { isMonthWithinRecurringRange } from "../../../domain/value-objects/month-period";
import { IncomeTaxationService } from "../../../services/income-taxation.service";
import { ForbiddenError } from "../../../utils/errors";

export class CreateRecurringIncomeUseCase {
  constructor(
    private readonly recurringIncomeRepository: IRecurringIncomeRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly userRepository: IUserRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly incomeTaxationService: IncomeTaxationService,
    private readonly incomeTaxRepository: IIncomeTaxRepository,
  ) {}

  async execute(recurringIncome: RecurringIncome, requestingUser: User) {
    recurringIncome.validateBaseFields();
    recurringIncome.normalizeTaxation();

    const startMonth = await this.validateUserAndMonth({
      userId: requestingUser.id,
      startMonthId: recurringIncome.startMonth.id,
    });

    const taxationFound = this.incomeTaxationService.normalizeTaxation();

    const newRecurringIncome = new RecurringIncomeEntity({
      ...recurringIncome,
      user: requestingUser,
      taxationMode: taxationFound.mode,
      taxationProfile: taxationFound.profile,
      taxationParameters: taxationFound.parameters,
    });

    const recurringIncomeCreated =
      await this.recurringIncomeRepository.create(newRecurringIncome);

    if (recurringIncomeCreated.status === RecurringIncomeStatus.ACTIVE) {
      await this.syncRecurringIncomeToOwnerMonths(
        recurringIncomeCreated,
        startMonth,
        requestingUser,
      );
    }

    return recurringIncome;
  }

  private async validateUserAndMonth(params: {
    userId: string;
    startMonthId: string;
  }) {
    const user = await this.userRepository.findById(params.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const startMonth = await this.monthRepository.findById(params.startMonthId);
    if (!startMonth) {
      throw new Error("Start month not found");
    }

    const startMonthUserId = startMonth.user.id;
    if (startMonthUserId && startMonthUserId !== params.userId) {
      throw new ForbiddenError(
        "Start month must belong to the same user as the recurring income definition",
      );
    }

    return startMonth;
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

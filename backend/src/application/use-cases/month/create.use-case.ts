import {
  ExpenseEntity,
  ExpenseKindType,
} from "../../../domain/entities/expense.entity";
import {
  MonthlyIncomeEntity,
  TaxationModeType,
} from "../../../domain/entities/monthly-income.entity";
import { Month } from "../../../domain/entities/month.entity";
import {
  RecurringExpenseEntity,
  RecurringExpenseStatus,
  type RecurringExpense,
} from "../../../domain/entities/recurring-expense.entity";
import {
  RecurringIncomeEntity,
  RecurringIncomeStatus,
  type RecurringIncome,
} from "../../../domain/entities/recurring-income.entity";
import { User } from "../../../domain/entities/user.entity";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { IRecurringExpenseRepository } from "../../../domain/repositories/recurring-expense.repository";
import { IRecurringIncomeRepository } from "../../../domain/repositories/recurring-income.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ExpenseRepository } from "../../../repositories/expense.repository";
import { IncomeTaxRepository } from "../../../repositories/income-tax.repository";
import { MonthRepository } from "../../../repositories/month.repository";
import { MonthlyIncomeRepository } from "../../../repositories/monthly-income.repository";
import { RecurringExpenseRepository } from "../../../repositories/recurring-expense.repository";
import { RecurringIncomeRepository } from "../../../repositories/recurring-income.repository";
import { UserRepository } from "../../../repositories/user.repository";
import { IncomeTaxationService } from "../../../services/income-taxation.service";
import { BadRequestError, NotFoundError } from "../../../utils/errors";
import { isMonthWithinRecurringRange } from "../../../utils/month-period";

type AutomaticTaxationParameters = {
  accountant_fee: number;
  das_rate?: number;
  pro_labore_rate?: number;
  inss_rate?: number;
  irrf_mode?: "disabled" | "manual_amount";
  irrf_manual_amount?: number;
};

export class CreateMonthUseCase {
  constructor(
    private readonly userRepository: IUserRepository = new UserRepository(),
    private readonly monthRepository: IMonthRepository = new MonthRepository(),
    private readonly recurringIncomeRepository: IRecurringIncomeRepository = new RecurringIncomeRepository(),
    private readonly recurringExpenseRepository: IRecurringExpenseRepository = new RecurringExpenseRepository(),
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository = new MonthlyIncomeRepository(),
    private readonly expenseRepository: IExpenseRepository = new ExpenseRepository(),
    private readonly incomeTaxRepository: IIncomeTaxRepository = new IncomeTaxRepository(),
    private readonly incomeTaxationService: IncomeTaxationService = new IncomeTaxationService(),
  ) {}

  async execute(month: Month, user: User): Promise<Month> {
    month.validatePeriod(month.year, month.month);

    const userFound = await this.userRepository.findById(user.id);
    if (!userFound) {
      throw new NotFoundError("User not found");
    }

    const existing = await this.monthRepository.findByUserAndPeriod(
      user.id,
      month.year,
      month.month,
    );
    if (existing) {
      throw new BadRequestError("Month already exists for this user");
    }

    const createdMonth = await this.monthRepository.create(month);

    await this.syncRecurringIncomesForMonth(createdMonth, userFound);
    await this.syncRecurringExpensesForMonth(createdMonth, userFound);

    return createdMonth;
  }

  async syncRecurringIncomesForMonth(month: Month, user: User): Promise<void> {
    const recurringIncomes = await this.recurringIncomeRepository.findByUserId(
      user.id,
    );

    for (const recurringIncome of recurringIncomes) {
      if (recurringIncome.status !== RecurringIncomeStatus.ACTIVE) {
        continue;
      }

      const startMonth = await this.monthRepository.findById(
        recurringIncome.startMonth.id,
      );
      if (
        !startMonth ||
        !isMonthWithinRecurringRange(
          startMonth,
          month,
          recurringIncome.occurrences,
        )
      ) {
        continue;
      }

      await this.generateMonthlyIncome(recurringIncome, month, user);
    }
  }

  async syncRecurringExpensesForMonth(month: Month, user: User): Promise<void> {
    const recurringExpenses =
      await this.recurringExpenseRepository.findByUserId(user.id);

    for (const recurringExpense of recurringExpenses) {
      if (recurringExpense.status !== RecurringExpenseStatus.ACTIVE) {
        continue;
      }

      const startMonth = await this.monthRepository.findById(
        recurringExpense.startMonth.id,
      );
      if (
        !startMonth ||
        !isMonthWithinRecurringRange(
          startMonth,
          month,
          recurringExpense.occurrences,
        )
      ) {
        continue;
      }

      await this.createRecurringExpenseEntry(recurringExpense, month);
    }
  }

  private normalizeRecurringIncomeTaxation(recurringIncome: RecurringIncome) {
    if (recurringIncome.taxationMode === TaxationModeType.AUTOMATIC) {
      return this.incomeTaxationService.normalizeTaxation({
        mode: TaxationModeType.AUTOMATIC,
        profile:
          recurringIncome.taxationProfile === "me_pro_labore"
            ? "me_pro_labore"
            : undefined,
        parameters: recurringIncome.taxationParameters as
          | AutomaticTaxationParameters
          | undefined,
      });
    }

    return this.incomeTaxationService.normalizeTaxation({
      mode: TaxationModeType.MANUAL,
    });
  }

  private async generateMonthlyIncome(
    recurringIncome: RecurringIncome,
    month: Month,
    user: User,
  ): Promise<void> {
    const existingIncome =
      await this.monthlyIncomeRepository.findRecurringIncomeEntry(
        recurringIncome.id,
        month.id,
      );
    if (existingIncome) {
      return;
    }

    const normalizedTaxation =
      this.normalizeRecurringIncomeTaxation(recurringIncome);

    const incomeEntity = new MonthlyIncomeEntity({
      user,
      month,
      recurringIncome: new RecurringIncomeEntity({ id: recurringIncome.id }),
      grossIncome: recurringIncome.grossIncome,
      incomeType: recurringIncome.incomeType,
      taxationMode: normalizedTaxation.mode as TaxationModeType,
      taxationProfile: normalizedTaxation.profile ?? undefined,
      taxationParameters:
        (normalizedTaxation.parameters as Record<string, unknown> | null) ??
        undefined,
      notes: recurringIncome.description,
    });

    incomeEntity.validateGrossIncome();
    incomeEntity.validateNotes();

    const income = await this.monthlyIncomeRepository.create(incomeEntity);
    const automaticTaxes = this.incomeTaxationService.calculateAutomaticTaxes(
      recurringIncome.grossIncome,
      normalizedTaxation,
    );

    if (automaticTaxes.length === 0) {
      return;
    }

    await this.incomeTaxRepository.createMany(
      automaticTaxes.map((tax) => ({
        monthlyIncomeId: income.id,
        taxType: tax.tax_type,
        value: tax.value,
        isAuto: true,
      })),
    );
  }

  private async createRecurringExpenseEntry(
    recurringExpense: RecurringExpense,
    month: Month,
  ) {
    const existingExpense =
      await this.expenseRepository.findRecurringExpenseEntry(
        recurringExpense.id,
        month.id,
      );
    if (existingExpense) {
      return existingExpense;
    }

    return this.expenseRepository.create(
      new ExpenseEntity({
        month,
        category: recurringExpense.category,
        subcategory: recurringExpense.subcategory,
        paidBy: recurringExpense.paidBy,
        responsibleUser: recurringExpense.responsibleUser,
        recurringExpense: new RecurringExpenseEntity({
          id: recurringExpense.id,
        }),
        expenseKind: recurringExpense.expenseKind ?? ExpenseKindType.STANDARD,
        plannedAmount: recurringExpense.plannedAmount ?? 0,
        isPaid: false,
        description: recurringExpense.description,
        value: recurringExpense.value,
        expenseDate: this.getMonthDate(month),
      }),
    );
  }

  private getMonthDate(month: Month): Date {
    return new Date(Date.UTC(month.year, month.month - 1, 1));
  }
}

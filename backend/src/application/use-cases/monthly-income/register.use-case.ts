import type { Transaction } from "sequelize";
import { sequelize } from "../../../database/connection";
import type { CreateMonthlyIncomeDTO } from "../../../dtos/monthly-income.dto";
import { MonthlyIncomeEntity } from "../../../domain/entities/monthly-income.entity";
import { MonthEntity } from "../../../domain/entities/month.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { RecurringIncomeEntity } from "../../../domain/entities/recurring-income.entity";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import type { IMonthRepository } from "../../../domain/repositories/month.repository";
import type { IUserRepository } from "../../../domain/repositories/user.repository";
import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import { MonthRepository } from "../../../repositories/month.repository";
import { UserRepository } from "../../../repositories/user.repository";
import { IncomeTaxRepository } from "../../../repositories/income-tax.repository";
import { IncomeTaxationService } from "../../../services/income-taxation.service";
import { BadRequestError, ForbiddenError } from "../../../utils/errors";

export class RegisterMonthlyIncomeUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly monthRepository: IMonthRepository = new MonthRepository(),
    private readonly userRepository: IUserRepository = new UserRepository(),
    private readonly incomeTaxRepository: IIncomeTaxRepository = new IncomeTaxRepository(),
    private readonly incomeTaxationService: IncomeTaxationService = new IncomeTaxationService(),
    private readonly runInTransaction: <T>(
      fn: (t: Transaction) => Promise<T>,
    ) => Promise<T> = (fn) => sequelize.transaction(fn),
  ) {}

  async execute(data: CreateMonthlyIncomeDTO, requestingUserId: string) {
    const entity = new MonthlyIncomeEntity({
      user: new UserEntity({ id: data.userId }),
      month: new MonthEntity({ id: data.monthId }),
      recurringIncome: data.recurringIncomeId
        ? new RecurringIncomeEntity({ id: data.recurringIncomeId })
        : undefined,
      grossIncome: data.grossIncome,
      incomeType: data.incomeType,
      taxationMode: "manual",
      notes: data.notes,
    });

    entity.validateGrossIncome();
    entity.validateNotes();

    const user = await this.userRepository.findById(requestingUserId);
    if (!user) throw new BadRequestError("User not found");

    const month = await this.monthRepository.findById(data.monthId);
    if (!month) throw new BadRequestError("Month not found");
    if (month.user.id !== requestingUserId) throw new ForbiddenError();

    const taxation = this.incomeTaxationService.normalizeTaxation(
      data.taxation,
    );
    entity.taxationMode = taxation.mode;
    entity.taxationProfile = taxation.profile;
    entity.taxationParameters = taxation.parameters as Record<
      string,
      unknown
    > | null;

    return this.runInTransaction(async (transaction) => {
      const income = await this.monthlyIncomeRepository.create(entity, {
        transaction,
      });

      const automaticTaxes = this.incomeTaxationService.calculateAutomaticTaxes(
        data.grossIncome,
        taxation,
      );
      if (automaticTaxes.length > 0) {
        await this.incomeTaxRepository.createMany(
          automaticTaxes.map((tax) => ({
            monthlyIncomeId: income.id,
            taxType: tax.tax_type,
            value: tax.value,
            isAuto: true as const,
          })),
          { transaction },
        );
      }

      return income;
    });
  }
}

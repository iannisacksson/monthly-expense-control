import type { Transaction } from "sequelize";
import { sequelize } from "../../../database/connection";
import type { CreateMonthlyIncomeDTO } from "../../../dtos/monthly-income.dto";
import { MonthlyIncomeEntity } from "../../../domain/entities/monthly-income.entity";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { IncomeTaxRepository } from "../../../repositories/income-tax.repository";
import { MonthRepository } from "../../../repositories/month.repository";
import { UserRepository } from "../../../repositories/user.repository";
import { IncomeTaxationService } from "../../../services/income-taxation.service";
import { BadRequestError, ForbiddenError } from "../../../utils/errors";

export class RegisterMonthlyIncomeUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly monthRepository: MonthRepository = new MonthRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly incomeTaxRepository: IncomeTaxRepository = new IncomeTaxRepository(),
    private readonly incomeTaxationService: IncomeTaxationService = new IncomeTaxationService(),
    private readonly runInTransaction: <T>(fn: (t: Transaction) => Promise<T>) => Promise<T> = (fn) => sequelize.transaction(fn),
  ) {}

  async execute(data: CreateMonthlyIncomeDTO, requestingUserId: string) {
    const entity = new MonthlyIncomeEntity({
      userId: data.userId,
      monthId: data.monthId,
      recurringIncomeId: data.recurringIncomeId,
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
    if (month.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError();

    const taxation = this.incomeTaxationService.normalizeTaxation(data.taxation);
    entity.taxationMode = taxation.mode;
    entity.taxationProfile = taxation.profile;
    entity.taxationParameters = taxation.parameters as Record<string, unknown> | null;

    return this.runInTransaction(async (transaction) => {
      const income = await this.monthlyIncomeRepository.create(entity, { transaction });

      const automaticTaxes = this.incomeTaxationService.calculateAutomaticTaxes(data.grossIncome, taxation);
      if (automaticTaxes.length > 0) {
        await this.incomeTaxRepository.createMany(
          automaticTaxes.map((tax) => ({
            monthly_income_id: income.id,
            tax_type: tax.tax_type,
            value: tax.value,
            is_auto: true as const,
          })),
          { transaction },
        );
      }

      return income;
    });
  }
}

import type { Transaction } from "sequelize";
import { sequelize } from "../../../database/connection";
import type {
  IncomeTaxationDTO,
  UpdateMonthlyIncomeDTO,
} from "../../../dtos/monthly-income.dto";
import type { MonthlyIncome } from "../../../domain/entities/monthly-income.entity";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import { IncomeTaxRepository } from "../../../repositories/income-tax.repository";
import { IncomeTaxationService } from "../../../services/income-taxation.service";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class UpdateMonthlyIncomeUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
    private readonly incomeTaxRepository: IIncomeTaxRepository = new IncomeTaxRepository(),
    private readonly incomeTaxationService: IncomeTaxationService = new IncomeTaxationService(),
    private readonly runInTransaction: <T>(
      fn: (t: Transaction) => Promise<T>,
    ) => Promise<T> = (fn) => sequelize.transaction(fn),
  ) {}

  async execute(
    id: string,
    data: UpdateMonthlyIncomeDTO,
    requestingUserId: string,
  ) {
    const existing = await this.monthlyIncomeRepository.findById(id);
    if (!existing) throw new NotFoundError("Monthly income not found");
    if (existing.user.id !== requestingUserId) throw new ForbiddenError();

    if (data.grossIncome !== undefined && data.grossIncome <= 0) {
      throw new Error("Income amount must be greater than zero");
    }
    if (data.notes !== undefined && data.notes.length > 255) {
      throw new Error("Income notes must be at most 255 characters");
    }

    const resolvedGrossIncome = data.grossIncome ?? existing.grossIncome;
    const taxation = this.resolveUpdatedTaxation(existing, data.taxation);

    return this.runInTransaction(async (transaction) => {
      const updated = await this.monthlyIncomeRepository.update(
        id,
        {
          grossIncome: data.grossIncome,
          incomeType: data.incomeType,
          notes: data.notes,
          taxationMode: taxation.mode,
          taxationProfile: taxation.profile,
          taxationParameters: taxation.parameters as Record<
            string,
            unknown
          > | null,
        },
        { transaction },
      );

      if (!updated) throw new NotFoundError("Monthly income not found");

      await this.incomeTaxRepository.deleteAutoByMonthlyIncomeId(id, {
        transaction,
      });

      const automaticTaxes = this.incomeTaxationService.calculateAutomaticTaxes(
        resolvedGrossIncome,
        taxation,
      );
      if (automaticTaxes.length > 0) {
        await this.incomeTaxRepository.createMany(
          automaticTaxes.map((tax) => ({
            monthlyIncomeId: id,
            taxType: tax.tax_type,
            value: tax.value,
            isAuto: true as const,
          })),
          { transaction },
        );
      }

      return updated;
    });
  }

  private resolveUpdatedTaxation(
    existing: MonthlyIncome,
    taxation?: IncomeTaxationDTO,
  ) {
    if (taxation) {
      return this.incomeTaxationService.normalizeTaxation(taxation);
    }

    return this.incomeTaxationService.normalizeTaxation({
      mode: existing.taxationMode,
      profile: existing.taxationProfile as "me_pro_labore" | undefined,
      parameters:
        existing.taxationParameters as IncomeTaxationDTO["parameters"],
    });
  }
}

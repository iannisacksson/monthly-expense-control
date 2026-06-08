import type { UpdateIncomeTaxDTO } from "../../../dtos/income-tax.dto";
import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import {
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} from "../../../utils/errors";
import { IncomeTax } from "../../../domain/entities/income-tax.entity";
import { User } from "../../../domain/entities/user.entity";

export class UpdateIncomeTaxUseCase {
  constructor(
    private readonly incomeTaxRepository: IIncomeTaxRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(incomeTax: IncomeTax, requestingUser: User) {
    const existingTax = await this.incomeTaxRepository.findById(incomeTax.id);
    if (!existingTax) {
      throw new NotFoundError("Income tax not found");
    }

    const income = await this.monthlyIncomeRepository.findById(
      existingTax.monthlyIncome.id,
    );
    if (!income || income.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    if (existingTax.isAuto) {
      throw new UnprocessableEntityError(
        "Automatic income taxes cannot be edited manually",
      );
    }

    if (
      incomeTax.taxType !== undefined &&
      (!incomeTax.taxType || incomeTax.taxType.length === 0)
    ) {
      throw new UnprocessableEntityError("Tax type is required");
    }

    if (incomeTax.value !== undefined && incomeTax.value < 0) {
      throw new UnprocessableEntityError(
        "Tax value must be greater than or equal to zero",
      );
    }

    existingTax.taxType = incomeTax.taxType ?? existingTax.taxType;
    existingTax.value = incomeTax.value ?? existingTax.value;
    existingTax.isAuto = false;

    const tax = await this.incomeTaxRepository.update(existingTax);

    return tax;
  }
}

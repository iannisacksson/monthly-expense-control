import { Month, MonthStatus } from "../../../domain/entities/month.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class FinalizeMonthUseCase {
  constructor(private readonly monthRepository: IMonthRepository) {}

  async execute(month: Month, requestingUser: UserEntity): Promise<Month> {
    const monthFound = await this.monthRepository.findById(month.id);
    if (!monthFound) {
      throw new NotFoundError("Month not found");
    }
    if (monthFound.user.id !== requestingUser.id) {
      throw new ForbiddenError("Month not found");
    }
    if (monthFound.isClosed()) {
      return monthFound;
    }

    monthFound.status = MonthStatus.CLOSED;

    const updatedMonth = await this.monthRepository.update(monthFound);

    return updatedMonth;
  }
}

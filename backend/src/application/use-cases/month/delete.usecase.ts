import { Month } from "../../../domain/entities/month.entity";
import { User, UserEntity } from "../../../domain/entities/user.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { MonthRepository } from "../../../repositories/month.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class DeleteMonthUseCase {
  constructor(
    private readonly monthRepository: IMonthRepository = new MonthRepository(),
  ) {}

  async execute(month: Month, requestingUser: UserEntity): Promise<void> {
    const monthFound = await this.monthRepository.findById(month.id);
    if (!monthFound) {
      throw new NotFoundError("Month not found");
    }
    if (monthFound.user.id !== requestingUser.id) {
      throw new ForbiddenError("Month not found");
    }

    monthFound.ensureDeletionAllowed();
  }
}

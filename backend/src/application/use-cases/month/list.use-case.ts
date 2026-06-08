import { Month } from "../../../domain/entities/month.entity";
import { User } from "../../../domain/entities/user.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";

export class ListMonthsUseCase {
  constructor(private readonly monthRepository: IMonthRepository) {}

  async execute(user: User): Promise<Month[]> {
    return this.monthRepository.findByUserId(user.id);
  }
}

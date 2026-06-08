import { User } from "../../../domain/entities/user.entity";
import { InstallmentGroup } from "../../../domain/entities/installment-group.entity";
import { IInstallmentGroupRepository } from "../../../domain/repositories/installment-group.repository";

export class ListInstallmentGroupsByUserUseCase {
  constructor(
    private readonly installmentGroupRepository: IInstallmentGroupRepository,
  ) {}

  async execute(user: User): Promise<InstallmentGroup[]> {
    return this.installmentGroupRepository.findByUser(user);
  }
}

import { User } from "../../../domain/entities/user.entity";
import { InstallmentGroup } from "../../../domain/entities/installment-group.entity";
import { IInstallmentGroupRepository } from "../../../domain/repositories/installment-group.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class FindInstallmentGroupByIdUseCase {
  constructor(
    private readonly installmentGroupRepository: IInstallmentGroupRepository,
  ) {}

  async execute(
    installmentGroup: InstallmentGroup,
    user: User,
  ): Promise<InstallmentGroup> {
    const group = await this.installmentGroupRepository.findById(
      installmentGroup.id,
    );
    if (!group) {
      throw new NotFoundError("Installment group not found");
    }
    if (group.user.id !== user.id) throw new ForbiddenError();
    return group;
  }
}

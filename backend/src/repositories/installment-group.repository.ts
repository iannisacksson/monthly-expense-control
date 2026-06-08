import type { InstallmentGroup } from "../domain/entities/installment-group.entity";
import type { User } from "../domain/entities/user.entity";
import type { IInstallmentGroupRepository } from "../domain/repositories/installment-group.repository";
import { InstallmentGroupModel } from "../models/installment-group.model";

export class InstallmentGroupRepository implements IInstallmentGroupRepository {
  async create(data: InstallmentGroup): Promise<InstallmentGroup> {
    const model = await InstallmentGroupModel.create(data);
    return model.toDomain();
  }

  async findById(id: string): Promise<InstallmentGroup | null> {
    const model = await InstallmentGroupModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByUser(user: User): Promise<InstallmentGroup[]> {
    const models = await InstallmentGroupModel.findAll({
      where: { userId: user.id },
    });
    return models.map((m) => m.toDomain());
  }

  async update(installmentGroup: InstallmentGroup): Promise<InstallmentGroup> {
    const [_, [model]] = await InstallmentGroupModel.update(installmentGroup, {
      where: { id: installmentGroup.id },
      returning: true,
    });
    return model.toDomain();
  }

  async delete(group: InstallmentGroup): Promise<void> {
    await InstallmentGroupModel.destroy({ where: { id: group.id } });
  }
}

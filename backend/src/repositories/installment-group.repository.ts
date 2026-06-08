import type { Category } from "../domain/entities/category.entity";
import type { InstallmentGroup } from "../domain/entities/installment-group.entity";
import type { Month } from "../domain/entities/month.entity";
import type { Subcategory } from "../domain/entities/subcategory.entity";
import type { User } from "../domain/entities/user.entity";
import type { IInstallmentGroupRepository } from "../domain/repositories/installment-group.repository";
import { InstallmentGroupModel } from "../models/installment-group.model";

export class InstallmentGroupRepository implements IInstallmentGroupRepository {
  async create(
    data: Omit<InstallmentGroup, "id" | "createdAt" | "updatedAt">,
  ): Promise<InstallmentGroup> {
    const model = await InstallmentGroupModel.create({
      user: data.user,
      description: data.description,
      totalValue: data.totalValue,
      installments: data.installments,
      startingInstallmentNumber: data.startingInstallmentNumber,
      category: data.category,
      subcategory: data.subcategory,
      paidBy: data.paidBy,
      responsibleUser: data.responsibleUser,
      startMonth: data.startMonth,
    });
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

  async update(
    id: string,
    data: Partial<{
      description: string;
      totalValue: number;
      installments: number;
      startingInstallmentNumber: number;
      category: Category;
      subcategory: Subcategory | null;
      paidBy: User | null;
      responsibleUser: User | null;
      startMonth: Month | null;
    }>,
  ): Promise<InstallmentGroup | null> {
    const model = await InstallmentGroupModel.findByPk(id);
    if (!model) return null;
    const updateData: Record<string, unknown> = { ...data };
    if (data.category !== undefined) {
      updateData.categoryId = data.category.id;
      delete updateData.category;
    }
    if (data.subcategory !== undefined) {
      updateData.subcategoryId = data.subcategory?.id ?? null;
      delete updateData.subcategory;
    }
    if (data.paidBy !== undefined) {
      updateData.paidById = data.paidBy?.id ?? null;
      delete updateData.paidBy;
    }
    if (data.responsibleUser !== undefined) {
      updateData.responsibleUserId = data.responsibleUser?.id ?? null;
      delete updateData.responsibleUser;
    }
    if (data.startMonth !== undefined) {
      updateData.startMonthId = data.startMonth?.id ?? null;
      delete updateData.startMonth;
    }
    await model.update(updateData);
    return model.toDomain();
  }

  async delete(group: InstallmentGroup): Promise<void> {
    const model = await InstallmentGroupModel.findByPk(group.id);
    if (!model) return;
    await model.destroy();
  }
}

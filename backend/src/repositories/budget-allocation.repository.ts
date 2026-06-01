import type { BudgetAllocation } from "../domain/entities/budget-allocation.entity";
import type { Category } from "../domain/entities/category.entity";
import type { IBudgetAllocationRepository } from "../domain/repositories/budget-allocation.repository";
import { BudgetAllocationModel } from "../models/budget-allocation.model";

export class BudgetAllocationRepository implements IBudgetAllocationRepository {
  async create(
    data: Omit<
      BudgetAllocation,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "validatePercentage"
      | "ensureTotalPercentageWithinLimit"
    >,
  ): Promise<BudgetAllocation> {
    const model = await BudgetAllocationModel.create({
      budgetRule: data.budgetRule,
      categoryId: data.category.id,
      percentage: data.percentage,
    });
    return model.toDomain();
  }

  async findById(id: string): Promise<BudgetAllocation | null> {
    const model = await BudgetAllocationModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByBudgetRuleId(budgetRuleId: string): Promise<BudgetAllocation[]> {
    const models = await BudgetAllocationModel.findAll({
      where: { budgetRuleId },
    });
    return models.map((m) => m.toDomain());
  }

  async update(
    id: string,
    data: Partial<{ category: Category; percentage: number }>,
  ): Promise<BudgetAllocation | null> {
    const model = await BudgetAllocationModel.findByPk(id);
    if (!model) return null;
    const updateData: Record<string, unknown> = {};
    if (data.category !== undefined) updateData.categoryId = data.category.id;
    if (data.percentage !== undefined) updateData.percentage = data.percentage;
    await model.update(updateData);
    return model.toDomain();
  }

  async delete(allocation: BudgetAllocation): Promise<void> {
    const model = await BudgetAllocationModel.findByPk(allocation.id);
    if (!model) return;
    await model.destroy();
  }
}

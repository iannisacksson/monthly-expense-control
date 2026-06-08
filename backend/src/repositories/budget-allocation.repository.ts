import type { BudgetAllocation } from "../domain/entities/budget-allocation.entity";
import { BudgetRule } from "../domain/entities/budget-rule.entity";
import type { Category } from "../domain/entities/category.entity";
import type { IBudgetAllocationRepository } from "../domain/repositories/budget-allocation.repository";
import { BudgetAllocationModel } from "../models/budget-allocation.model";

export class BudgetAllocationRepository implements IBudgetAllocationRepository {
  async create(data: BudgetAllocation): Promise<BudgetAllocation> {
    const model = await BudgetAllocationModel.create(data);
    return model.toDomain();
  }

  async findById(id: string): Promise<BudgetAllocation | null> {
    const model = await BudgetAllocationModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByBudgetRule(budgetRule: BudgetRule): Promise<BudgetAllocation[]> {
    const models = await BudgetAllocationModel.findAll({
      where: { budgetRuleId: budgetRule.id },
    });
    return models.map((m) => m.toDomain());
  }

  async update(budgetAllocation: BudgetAllocation): Promise<BudgetAllocation> {
    const [_, [model]] = await BudgetAllocationModel.update(budgetAllocation, {
      where: { id: budgetAllocation.id },
      returning: true,
    });
    return model.toDomain();
  }

  async delete(allocation: BudgetAllocation): Promise<void> {
    const model = await BudgetAllocationModel.findByPk(allocation.id);
    if (!model) return;
    await model.destroy();
  }
}

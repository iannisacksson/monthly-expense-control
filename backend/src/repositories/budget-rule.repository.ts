import type { BudgetRule } from "../domain/entities/budget-rule.entity";
import { User } from "../domain/entities/user.entity";
import type { IBudgetRuleRepository } from "../domain/repositories/budget-rule.repository";
import { BudgetRuleModel } from "../models/budget-rule.model";

export class BudgetRuleRepository implements IBudgetRuleRepository {
  async create(
    data: Omit<BudgetRule, "id" | "createdAt" | "updatedAt" | "validateName">,
  ): Promise<BudgetRule> {
    const model = await BudgetRuleModel.create({
      user: data.user,
      name: data.name,
    });
    return model.toDomain();
  }

  async findById(id: string): Promise<BudgetRule | null> {
    const model = await BudgetRuleModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByUser(user: User): Promise<BudgetRule[]> {
    const models = await BudgetRuleModel.findAll({
      where: { userId: user.id },
    });
    return models.map((m) => m.toDomain());
  }

  async update(
    id: string,
    data: Partial<{ name: string }>,
  ): Promise<BudgetRule | null> {
    const model = await BudgetRuleModel.findByPk(id);
    if (!model) return null;
    await model.update(data);
    return model.toDomain();
  }

  async delete(rule: BudgetRule): Promise<void> {
    const model = await BudgetRuleModel.findByPk(rule.id);
    if (!model) return;
    await model.destroy();
  }
}

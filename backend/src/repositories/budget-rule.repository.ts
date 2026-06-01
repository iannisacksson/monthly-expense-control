import { BudgetRule } from "../models/index";

export class BudgetRuleRepository {
  async create(data: { user_id?: string; name: string }) {
    return BudgetRule.create(data);
  }

  async findById(id: string) {
    return BudgetRule.findByPk(id);
  }

  async findByUserId(userId: string) {
    return BudgetRule.findAll({ where: { user_id: userId } });
  }

  async update(id: string, data: Partial<{ name: string }>) {
    const rule = await BudgetRule.findByPk(id);
    if (!rule) return null;
    return rule.update(data);
  }

  async delete(id: string) {
    const rule = await BudgetRule.findByPk(id);
    if (!rule) return null;
    await rule.destroy();
    return rule;
  }
}

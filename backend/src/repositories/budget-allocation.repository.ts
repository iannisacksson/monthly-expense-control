import { BudgetAllocation } from "../models/index"

export class BudgetAllocationRepository {
  async create(data: {
    budget_rule_id: string
    category_id: string
    percentage: number
  }) {
    return BudgetAllocation.create(data)
  }

  async findById(id: string) {
    return BudgetAllocation.findByPk(id)
  }

  async findByBudgetRuleId(budgetRuleId: string) {
    return BudgetAllocation.findAll({ where: { budget_rule_id: budgetRuleId } })
  }

  async update(id: string, data: Partial<{ category_id: string; percentage: number }>) {
    const allocation = await BudgetAllocation.findByPk(id)
    if (!allocation) return null
    return allocation.update(data)
  }

  async delete(id: string) {
    const allocation = await BudgetAllocation.findByPk(id)
    if (!allocation) return null
    await allocation.destroy()
    return allocation
  }
}

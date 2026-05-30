import { BudgetRuleRepository } from "../repositories/budget-rule.repository"
import { BudgetAllocationRepository } from "../repositories/budget-allocation.repository"
import { CategoryRepository } from "../repositories/category.repository"
import { UserRepository } from "../repositories/user.repository"
import { CreateBudgetRuleDTO, UpdateBudgetRuleDTO } from "../dtos/budget-rule.dto"
import { CreateBudgetAllocationDTO, UpdateBudgetAllocationDTO } from "../dtos/budget-allocation.dto"
import { ForbiddenError } from "../utils/errors"
import { BudgetAllocationEntity } from "../domain/entities/budget-allocation.entity";
import { BudgetRuleEntity } from "../domain/entities/budget-rule.entity";

const budgetRuleRepository = new BudgetRuleRepository()
const budgetAllocationRepository = new BudgetAllocationRepository()
const categoryRepository = new CategoryRepository()
const userRepository = new UserRepository()

export class BudgetService {
  private async ensureCategoryMatchesRuleOwner(categoryId: string, rule: { getDataValue: (field: string) => unknown }) {
    const category = await categoryRepository.findById(categoryId)
    if (!category) {
      throw new Error("Category not found")
    }

    const categoryUserId = category.getDataValue("user_id") as string | null
    const ruleUserId = rule.getDataValue("user_id") as string | null
    const isSameOwner = !!categoryUserId && !!ruleUserId && categoryUserId === ruleUserId

    if (!isSameOwner) {
      throw new Error("Category must belong to the same owner as the budget rule")
    }

    return category
  }

  async createBudgetRule(data: CreateBudgetRuleDTO, requestingUserId: string) {
    BudgetRuleEntity.validateName(data.name);

    const user = await userRepository.findById(requestingUserId)
    if (!user) {
      throw new Error("User not found")
    }

    return budgetRuleRepository.create({
      user_id: requestingUserId,
      name: data.name,
    })
  }

  async findBudgetRuleById(id: string, requestingUserId: string) {
    const rule = await budgetRuleRepository.findById(id)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    if (rule.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
    return rule
  }

  async listBudgetRulesByUser(userId: string) {
    return budgetRuleRepository.findByUserId(userId)
  }

  async updateBudgetRule(id: string, data: UpdateBudgetRuleDTO, requestingUserId: string) {
    if (data.name !== undefined) BudgetRuleEntity.validateName(data.name);

    const existing = await budgetRuleRepository.findById(id)
    if (!existing) throw new Error("Budget rule not found")
    if (existing.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const rule = await budgetRuleRepository.update(id, data)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    return rule
  }

  async deleteBudgetRule(id: string, requestingUserId: string) {
    const existing = await budgetRuleRepository.findById(id)
    if (!existing) throw new Error("Budget rule not found")
    if (existing.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const rule = await budgetRuleRepository.delete(id)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    return rule
  }

  async createAllocation(data: CreateBudgetAllocationDTO, requestingUserId: string) {
    BudgetAllocationEntity.validatePercentage(data.percentage);

    const rule = await budgetRuleRepository.findById(data.budget_rule_id)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    if (rule.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    await this.ensureCategoryMatchesRuleOwner(data.category_id, rule)

    const existingAllocations = await budgetAllocationRepository.findByBudgetRuleId(data.budget_rule_id)
    const currentTotal = existingAllocations.reduce(
      (sum, alloc) => sum + Number(alloc.getDataValue("percentage")),
      0
    )

    BudgetAllocationEntity.ensureTotalPercentageWithinLimit(
      currentTotal,
      data.percentage,
    );

    return budgetAllocationRepository.create(data)
  }

  async listAllocationsByRule(budgetRuleId: string, requestingUserId: string) {
    const rule = await budgetRuleRepository.findById(budgetRuleId)
    if (!rule || rule.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
    return budgetAllocationRepository.findByBudgetRuleId(budgetRuleId)
  }

  async updateAllocation(id: string, data: UpdateBudgetAllocationDTO, requestingUserId: string) {
    if (data.percentage !== undefined)
      BudgetAllocationEntity.validatePercentage(data.percentage);

    const existingAllocation = await budgetAllocationRepository.findById(id)
    if (!existingAllocation) {
      throw new Error("Budget allocation not found")
    }

    const ruleId = existingAllocation.getDataValue("budget_rule_id") as string
    const rule = await budgetRuleRepository.findById(ruleId)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    if (rule.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    if (data.category_id) {
      await this.ensureCategoryMatchesRuleOwner(data.category_id, rule)
    }

    if (data.percentage !== undefined) {
      const existingAllocations = await budgetAllocationRepository.findByBudgetRuleId(ruleId)
      const currentTotal = existingAllocations
        .filter((alloc) => alloc.getDataValue("id") !== id)
        .reduce((sum, alloc) => sum + Number(alloc.getDataValue("percentage")), 0)

      BudgetAllocationEntity.ensureTotalPercentageWithinLimit(
        currentTotal,
        data.percentage,
      );
    }

    const allocation = await budgetAllocationRepository.update(id, data)
    if (!allocation) {
      throw new Error("Budget allocation not found")
    }
    return allocation
  }

  async deleteAllocation(id: string, requestingUserId: string) {
    const existing = await budgetAllocationRepository.findById(id)
    if (!existing) throw new Error("Budget allocation not found")
    const rule = await budgetRuleRepository.findById(existing.getDataValue("budget_rule_id") as string)
    if (!rule || rule.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const allocation = await budgetAllocationRepository.delete(id)
    if (!allocation) {
      throw new Error("Budget allocation not found")
    }
    return allocation
  }
}

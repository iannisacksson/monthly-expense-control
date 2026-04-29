import { BudgetRuleRepository } from "../repositories/budget-rule.repository"
import { BudgetAllocationRepository } from "../repositories/budget-allocation.repository"
import { CategoryRepository } from "../repositories/category.repository"
import { UserRepository } from "../repositories/user.repository"
import { CreateBudgetRuleDTO, UpdateBudgetRuleDTO } from "../dtos/budget-rule.dto"
import { CreateBudgetAllocationDTO, UpdateBudgetAllocationDTO } from "../dtos/budget-allocation.dto"

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

  async createBudgetRule(data: CreateBudgetRuleDTO) {
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      throw new Error("Budget rule name must be between 2 and 100 characters")
    }

    if (!data.user_id) {
      throw new Error("Budget rule must belong to a user")
    }

    const ownerUserId = data.user_id

    if (ownerUserId) {
      const user = await userRepository.findById(ownerUserId)
      if (!user) {
        throw new Error("User not found")
      }
    }

    return budgetRuleRepository.create({
      user_id: ownerUserId,
      name: data.name,
    })
  }

  async findBudgetRuleById(id: string) {
    const rule = await budgetRuleRepository.findById(id)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    return rule
  }

  async listBudgetRulesByUser(userId: string) {
    return budgetRuleRepository.findByUserId(userId)
  }

  async updateBudgetRule(id: string, data: UpdateBudgetRuleDTO) {
    if (data.name !== undefined && (data.name.length < 2 || data.name.length > 100)) {
      throw new Error("Budget rule name must be between 2 and 100 characters")
    }

    const rule = await budgetRuleRepository.update(id, data)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    return rule
  }

  async deleteBudgetRule(id: string) {
    const rule = await budgetRuleRepository.delete(id)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    return rule
  }

  async createAllocation(data: CreateBudgetAllocationDTO) {
    if (data.percentage <= 0 || data.percentage > 100) {
      throw new Error("Percentage must be between 0 and 100")
    }

    const rule = await budgetRuleRepository.findById(data.budget_rule_id)
    if (!rule) {
      throw new Error("Budget rule not found")
    }

    await this.ensureCategoryMatchesRuleOwner(data.category_id, rule)

    const existingAllocations = await budgetAllocationRepository.findByBudgetRuleId(data.budget_rule_id)
    const currentTotal = existingAllocations.reduce(
      (sum, alloc) => sum + Number(alloc.getDataValue("percentage")),
      0
    )

    if (currentTotal + data.percentage > 100) {
      throw new Error("Total allocation percentage cannot exceed 100%")
    }

    return budgetAllocationRepository.create(data)
  }

  async listAllocationsByRule(budgetRuleId: string) {
    return budgetAllocationRepository.findByBudgetRuleId(budgetRuleId)
  }

  async updateAllocation(id: string, data: UpdateBudgetAllocationDTO) {
    if (data.percentage !== undefined && (data.percentage <= 0 || data.percentage > 100)) {
      throw new Error("Percentage must be between 0 and 100")
    }

    const existingAllocation = await budgetAllocationRepository.findById(id)
    if (!existingAllocation) {
      throw new Error("Budget allocation not found")
    }

    const ruleId = existingAllocation.getDataValue("budget_rule_id") as string
    const rule = await budgetRuleRepository.findById(ruleId)
    if (!rule) {
      throw new Error("Budget rule not found")
    }

    if (data.category_id) {
      await this.ensureCategoryMatchesRuleOwner(data.category_id, rule)
    }

    if (data.percentage !== undefined) {
      const existingAllocations = await budgetAllocationRepository.findByBudgetRuleId(ruleId)
      const currentTotal = existingAllocations
        .filter((alloc) => alloc.getDataValue("id") !== id)
        .reduce((sum, alloc) => sum + Number(alloc.getDataValue("percentage")), 0)

      if (currentTotal + data.percentage > 100) {
        throw new Error("Total allocation percentage cannot exceed 100%")
      }
    }

    const allocation = await budgetAllocationRepository.update(id, data)
    if (!allocation) {
      throw new Error("Budget allocation not found")
    }
    return allocation
  }

  async deleteAllocation(id: string) {
    const allocation = await budgetAllocationRepository.delete(id)
    if (!allocation) {
      throw new Error("Budget allocation not found")
    }
    return allocation
  }
}

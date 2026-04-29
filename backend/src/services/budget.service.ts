import { BudgetRuleRepository } from "../repositories/budget-rule.repository"
import { BudgetAllocationRepository } from "../repositories/budget-allocation.repository"
import { FamilyRepository } from "../repositories/family.repository"
import { CategoryRepository } from "../repositories/category.repository"
import { UserRepository } from "../repositories/user.repository"
import { CreateBudgetRuleDTO, UpdateBudgetRuleDTO } from "../dtos/budget-rule.dto"
import { CreateBudgetAllocationDTO, UpdateBudgetAllocationDTO } from "../dtos/budget-allocation.dto"

const budgetRuleRepository = new BudgetRuleRepository()
const budgetAllocationRepository = new BudgetAllocationRepository()
const familyRepository = new FamilyRepository()
const categoryRepository = new CategoryRepository()
const userRepository = new UserRepository()

export class BudgetService {
  async createBudgetRule(data: CreateBudgetRuleDTO) {
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      throw new Error("Budget rule name must be between 2 and 100 characters")
    }

    if (!data.user_id && !data.family_id) {
      throw new Error("Budget rule must belong to a user or a legacy family context")
    }

    if (data.user_id) {
      const user = await userRepository.findById(data.user_id)
      if (!user) {
        throw new Error("User not found")
      }
    }

    if (data.family_id) {
      const family = await familyRepository.findById(data.family_id)
      if (!family) {
        throw new Error("Family not found")
      }
    }

    return budgetRuleRepository.create(data)
  }

  async findBudgetRuleById(id: string) {
    const rule = await budgetRuleRepository.findById(id)
    if (!rule) {
      throw new Error("Budget rule not found")
    }
    return rule
  }

  async listBudgetRulesByFamily(familyId: string) {
    return budgetRuleRepository.findByFamilyId(familyId)
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

    const category = await categoryRepository.findById(data.category_id)
    if (!category) {
      throw new Error("Category not found")
    }

    const categoryUserId = category.getDataValue("user_id") as string | null
    const ruleUserId = rule.getDataValue("user_id") as string | null
    const categoryFamilyId = category.getDataValue("family_id") as string | null
    const ruleFamilyId = rule.getDataValue("family_id") as string | null

    const isSameOwner = (categoryUserId && ruleUserId && categoryUserId === ruleUserId)
      || (categoryFamilyId && ruleFamilyId && categoryFamilyId === ruleFamilyId)

    if (!isSameOwner) {
      throw new Error("Category must belong to the same owner as the budget rule")
    }

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
      const category = await categoryRepository.findById(data.category_id)
      if (!category) {
        throw new Error("Category not found")
      }

      const categoryUserId = category.getDataValue("user_id") as string | null
      const ruleUserId = rule.getDataValue("user_id") as string | null
      const categoryFamilyId = category.getDataValue("family_id") as string | null
      const ruleFamilyId = rule.getDataValue("family_id") as string | null

      const isSameOwner = (categoryUserId && ruleUserId && categoryUserId === ruleUserId)
        || (categoryFamilyId && ruleFamilyId && categoryFamilyId === ruleFamilyId)

      if (!isSameOwner) {
        throw new Error("Category must belong to the same owner as the budget rule")
      }
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

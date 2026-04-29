import { MonthRepository } from "../repositories/month.repository"
import { RecurringExpenseService } from "./recurring-expense.service"
import { RecurringIncomeService } from "./recurring-income.service"
import { UserRepository } from "../repositories/user.repository"
import { BudgetRuleRepository } from "../repositories/budget-rule.repository"
import { CreateMonthDTO, UpdateMonthDTO } from "../dtos/month.dto"
import { ForbiddenError } from "../utils/errors"

const monthRepository = new MonthRepository()
const userRepository = new UserRepository()
const budgetRuleRepository = new BudgetRuleRepository()
const recurringExpenseService = new RecurringExpenseService()
const recurringIncomeService = new RecurringIncomeService()

export class MonthService {
  private async validateBudgetRuleOwnership(monthId: string, budgetRuleId: string | null | undefined) {
    if (budgetRuleId === undefined) {
      return
    }

    if (budgetRuleId === null) {
      return
    }

    const month = await monthRepository.findById(monthId)
    if (!month) {
      throw new Error("Month not found")
    }

    const rule = await budgetRuleRepository.findById(budgetRuleId)
    if (!rule) {
      throw new Error("Budget rule not found")
    }

    const monthUserId = month.getDataValue("user_id") as string | null
    const ruleUserId = rule.getDataValue("user_id") as string | null

    const sameOwner = !!monthUserId && !!ruleUserId && monthUserId === ruleUserId

    if (!sameOwner) {
      throw new Error("Budget rule must belong to the same owner as the month")
    }
  }

  async createMonth(data: CreateMonthDTO) {
    if (data.month < 1 || data.month > 12) {
      throw new Error("Month must be between 1 and 12")
    }

    if (data.year < 2000 || data.year > 2100) {
      throw new Error("Year must be between 2000 and 2100")
    }

    const user = await userRepository.findById(data.user_id)
    if (!user) {
      throw new Error("User not found")
    }

    const existing = await monthRepository.findByUserAndPeriod(data.user_id, data.year, data.month)
    if (existing) {
      throw new Error("Month already exists for this user")
    }

    const month = await monthRepository.create(data)

    const monthId = month.getDataValue("id") as string
    await recurringIncomeService.syncRecurringIncomesForMonth(monthId)
    await recurringExpenseService.syncRecurringExpensesForMonth(monthId)

    return month
  }

  async findMonthById(id: string, requestingUserId: string) {
    const month = await monthRepository.findById(id)
    if (!month) {
      throw new Error("Month not found")
    }
    if (month.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }
    return month
  }

  async listMonthsByUser(userId: string) {
    return monthRepository.findByUserId(userId)
  }

  async updateMonth(id: string, data: UpdateMonthDTO, requestingUserId: string) {
    if (data.status !== undefined && !["open", "closed"].includes(data.status)) {
      throw new Error("Status must be open or closed")
    }

    await this.validateBudgetRuleOwnership(id, data.budget_rule_id)

    const existing = await monthRepository.findById(id)
    if (!existing) throw new Error("Month not found")
    if (existing.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const month = await monthRepository.update(id, data)
    if (!month) {
      throw new Error("Month not found")
    }
    return month
  }

  async deleteMonth(id: string, requestingUserId: string) {
    const month = await monthRepository.findById(id)
    if (!month) {
      throw new Error("Month not found")
    }
    if (month.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    throw new Error("Month deletion is not allowed")
  }

  async finalizeMonth(id: string, requestingUserId: string) {
    const month = await monthRepository.findById(id)
    if (!month) {
      throw new Error("Month not found")
    }
    if (month.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    if ((month.getDataValue("status") as string) === "closed") {
      return month
    }

    const updatedMonth = await monthRepository.update(id, { status: "closed" })
    if (!updatedMonth) {
      throw new Error("Month not found")
    }

    return updatedMonth
  }
}

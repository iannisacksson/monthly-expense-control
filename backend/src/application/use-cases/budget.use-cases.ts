import type { CreateBudgetAllocationDTO, UpdateBudgetAllocationDTO } from "../../dtos/budget-allocation.dto"
import type { CreateBudgetRuleDTO, UpdateBudgetRuleDTO } from "../../dtos/budget-rule.dto"
import { BudgetService } from "../../services/budget.service"

const budgetService = new BudgetService()

export class CreateBudgetRuleUseCase { execute(data: CreateBudgetRuleDTO, userId: string) { return budgetService.createBudgetRule(data, userId) } }
export class ListBudgetRulesUseCase { execute(userId: string) { return budgetService.listBudgetRulesByUser(userId) } }
export class GetBudgetRuleByIdUseCase { execute(id: string, userId: string) { return budgetService.findBudgetRuleById(id, userId) } }
export class UpdateBudgetRuleUseCase { execute(id: string, data: UpdateBudgetRuleDTO, userId: string) { return budgetService.updateBudgetRule(id, data, userId) } }
export class DeleteBudgetRuleUseCase { execute(id: string, userId: string) { return budgetService.deleteBudgetRule(id, userId) } }
export class CreateBudgetAllocationUseCase { execute(data: CreateBudgetAllocationDTO, userId: string) { return budgetService.createAllocation(data, userId) } }
export class ListBudgetAllocationsUseCase { execute(ruleId: string, userId: string) { return budgetService.listAllocationsByRule(ruleId, userId) } }
export class UpdateBudgetAllocationUseCase { execute(id: string, data: UpdateBudgetAllocationDTO, userId: string) { return budgetService.updateAllocation(id, data, userId) } }
export class DeleteBudgetAllocationUseCase { execute(id: string, userId: string) { return budgetService.deleteAllocation(id, userId) } }
import type { CreateRecurringIncomeDTO, UpdateRecurringIncomeDTO } from "../../dtos/recurring-income.dto"
import { RecurringIncomeService } from "../../services/recurring-income.service"

const recurringIncomeService = new RecurringIncomeService()

export class CreateRecurringIncomeUseCase { execute(data: CreateRecurringIncomeDTO, userId: string) { return recurringIncomeService.createRecurringIncome(data, userId) } }
export class ListRecurringIncomesUseCase { execute(userId: string) { return recurringIncomeService.listRecurringIncomesByUser(userId) } }
export class GetRecurringIncomeByIdUseCase { execute(id: string, userId: string) { return recurringIncomeService.findRecurringIncomeById(id, userId) } }
export class UpdateRecurringIncomeUseCase { execute(id: string, data: UpdateRecurringIncomeDTO, userId: string) { return recurringIncomeService.updateRecurringIncome(id, data, userId) } }
export class ListRecurringIncomeEntriesUseCase { execute(id: string, userId: string) { return recurringIncomeService.findMonthlyIncomesByRecurringIncome(id, userId) } }
export class DeleteRecurringIncomeUseCase { execute(id: string, userId: string) { return recurringIncomeService.deleteRecurringIncome(id, userId) } }
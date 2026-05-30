import type { CreateMonthlyIncomeDTO, UpdateMonthlyIncomeDTO } from "../../dtos/monthly-income.dto"
import { MonthlyIncomeService } from "../../services/monthly-income.service"

const monthlyIncomeService = new MonthlyIncomeService()

export class RegisterMonthlyIncomeUseCase { execute(data: CreateMonthlyIncomeDTO, userId: string) { return monthlyIncomeService.registerIncome(data, userId) } }
export class ListMonthlyIncomesUseCase { execute(monthId: string, userId: string) { return monthlyIncomeService.listIncomesByMonth(monthId, userId) } }
export class GetMonthlyIncomeByIdUseCase { execute(id: string, userId: string) { return monthlyIncomeService.findIncomeById(id, userId) } }
export class UpdateMonthlyIncomeUseCase { execute(id: string, data: UpdateMonthlyIncomeDTO, userId: string) { return monthlyIncomeService.updateIncome(id, data, userId) } }
export class DeleteMonthlyIncomeUseCase { execute(id: string, userId: string) { return monthlyIncomeService.deleteIncome(id, userId) } }
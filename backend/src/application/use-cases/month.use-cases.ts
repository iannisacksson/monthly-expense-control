import type { CreateMonthDTO, UpdateMonthDTO } from "../../dtos/month.dto"
import { MonthService } from "../../services/month.service"

const monthService = new MonthService()

export class CreateMonthUseCase { execute(data: CreateMonthDTO) { return monthService.createMonth(data) } }
export class ListMonthsUseCase { execute(userId: string) { return monthService.listMonthsByUser(userId) } }
export class GetMonthByIdUseCase { execute(id: string, userId: string) { return monthService.findMonthById(id, userId) } }
export class UpdateMonthUseCase { execute(id: string, data: UpdateMonthDTO, userId: string) { return monthService.updateMonth(id, data, userId) } }
export class DeleteMonthUseCase { execute(id: string, userId: string) { return monthService.deleteMonth(id, userId) } }
export class FinalizeMonthUseCase { execute(id: string, userId: string) { return monthService.finalizeMonth(id, userId) } }
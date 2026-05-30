import type { CreateInstallmentGroupDTO, RestoreInstallmentOccurrenceDTO, UpdateInstallmentGroupDTO } from "../../dtos/installment-group.dto"
import { InstallmentGroupService } from "../../services/installment-group.service"

const installmentGroupService = new InstallmentGroupService()

export class CreateInstallmentGroupUseCase { execute(data: CreateInstallmentGroupDTO, userId: string) { return installmentGroupService.createInstallmentPurchase(data, userId) } }
export class ListInstallmentGroupsUseCase { execute(userId: string) { return installmentGroupService.listInstallmentGroupsByUser(userId) } }
export class GetInstallmentGroupByIdUseCase { execute(id: string, userId: string) { return installmentGroupService.findInstallmentGroupById(id, userId) } }
export class UpdateInstallmentGroupUseCase { execute(id: string, data: UpdateInstallmentGroupDTO, userId: string) { return installmentGroupService.updateInstallmentGroup(id, data, userId) } }
export class RestoreInstallmentOccurrenceUseCase { execute(id: string, data: RestoreInstallmentOccurrenceDTO, userId: string) { return installmentGroupService.restoreInstallmentOccurrence(id, data.month_id, userId) } }
export class ListInstallmentGroupExpensesUseCase { execute(id: string, userId: string) { return installmentGroupService.findExpensesByInstallmentGroup(id, userId) } }
export class DeleteInstallmentGroupUseCase { execute(id: string, data: UpdateInstallmentGroupDTO | undefined, userId: string) { return installmentGroupService.deleteInstallmentGroup(id, data, userId) } }
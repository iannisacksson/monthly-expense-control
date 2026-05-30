import type { CreateIncomeTaxDTO, UpdateIncomeTaxDTO } from "../../dtos/income-tax.dto"
import { IncomeTaxService } from "../../services/income-tax.service"

const incomeTaxService = new IncomeTaxService()

export class CreateIncomeTaxUseCase { execute(data: CreateIncomeTaxDTO, userId: string) { return incomeTaxService.createTax(data, userId) } }
export class ListIncomeTaxesUseCase { execute(incomeId: string, userId: string) { return incomeTaxService.listTaxesByIncome(incomeId, userId) } }
export class GetIncomeTaxByIdUseCase { execute(id: string, userId: string) { return incomeTaxService.findTaxById(id, userId) } }
export class UpdateIncomeTaxUseCase { execute(id: string, data: UpdateIncomeTaxDTO, userId: string) { return incomeTaxService.updateTax(id, data, userId) } }
export class DeleteIncomeTaxUseCase { execute(id: string, userId: string) { return incomeTaxService.deleteTax(id, userId) } }
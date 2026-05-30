import type { UpdateRecurringIncomeDTO } from "../../../../dtos/recurring-income.dto"
import { UpdateRecurringIncomeUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateRecurringIncomeUseCase = new UpdateRecurringIncomeUseCase()

export async function updateRecurringIncomeController(
  request: AuthenticatedHttpRequest<UpdateRecurringIncomeDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateRecurringIncomeUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 200, body: result }
}

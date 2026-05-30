import type { CreateRecurringIncomeDTO } from "../../../../dtos/recurring-income.dto"
import { CreateRecurringIncomeUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createRecurringIncomeUseCase = new CreateRecurringIncomeUseCase()

export async function createRecurringIncomeController(
  request: AuthenticatedHttpRequest<CreateRecurringIncomeDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await createRecurringIncomeUseCase.execute(request.body, request.userId)
  return { statusCode: 201, body: result }
}

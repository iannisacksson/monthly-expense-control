import { ListRecurringIncomesUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listRecurringIncomesUseCase = new ListRecurringIncomesUseCase()

export async function listRecurringIncomesByUserController(
  request: AuthenticatedHttpRequest,
): Promise<HttpResponse<unknown>> {
  const result = await listRecurringIncomesUseCase.execute(request.userId)
  return { statusCode: 200, body: result }
}

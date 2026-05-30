import { GetRecurringIncomeByIdUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getRecurringIncomeByIdUseCase = new GetRecurringIncomeByIdUseCase()

export async function getRecurringIncomeByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getRecurringIncomeByIdUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

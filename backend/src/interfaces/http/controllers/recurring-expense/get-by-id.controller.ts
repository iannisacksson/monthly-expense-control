import { GetRecurringExpenseByIdUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getRecurringExpenseByIdUseCase = new GetRecurringExpenseByIdUseCase()

export async function getRecurringExpenseByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getRecurringExpenseByIdUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

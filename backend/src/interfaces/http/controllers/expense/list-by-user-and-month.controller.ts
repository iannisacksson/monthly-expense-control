import { ListExpensesByMonthUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listExpensesByMonthUseCase = new ListExpensesByMonthUseCase()

export async function listExpensesByUserAndMonthController(
  request: AuthenticatedHttpRequest<unknown, { userId: string; monthId: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listExpensesByMonthUseCase.execute(request.userId, request.params.monthId)
  return { statusCode: 200, body: result }
}

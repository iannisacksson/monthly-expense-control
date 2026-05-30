import { ListExpenseAdjustmentsUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listExpenseAdjustmentsUseCase = new ListExpenseAdjustmentsUseCase()

export async function listExpenseAdjustmentsController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listExpenseAdjustmentsUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

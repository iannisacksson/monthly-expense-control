import { ListExpenseItemsUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listExpenseItemsUseCase = new ListExpenseItemsUseCase()

export async function listExpenseItemsController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listExpenseItemsUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

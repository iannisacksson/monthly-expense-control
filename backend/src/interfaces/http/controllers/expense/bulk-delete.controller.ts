import type { BulkDeleteExpensesDTO } from "../../../../dtos/expense.dto"
import { BulkDeleteExpensesUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const bulkDeleteExpensesUseCase = new BulkDeleteExpensesUseCase()

export async function bulkDeleteExpensesController(
  request: AuthenticatedHttpRequest<BulkDeleteExpensesDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await bulkDeleteExpensesUseCase.execute(request.body, request.userId)
  return { statusCode: 200, body: result }
}

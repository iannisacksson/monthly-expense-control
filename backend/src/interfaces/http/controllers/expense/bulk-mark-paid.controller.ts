import type { BulkMarkExpensesPaidDTO } from "../../../../dtos/expense.dto"
import { BulkMarkExpensesPaidUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const bulkMarkExpensesPaidUseCase = new BulkMarkExpensesPaidUseCase()

export async function bulkMarkExpensesPaidController(
  request: AuthenticatedHttpRequest<BulkMarkExpensesPaidDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await bulkMarkExpensesPaidUseCase.execute(request.body, request.userId)
  return { statusCode: 200, body: result }
}

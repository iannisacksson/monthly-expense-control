import { ListRecurringExpenseEntriesUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listRecurringExpenseEntriesUseCase = new ListRecurringExpenseEntriesUseCase()

export async function getExpensesByRecurringExpenseController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listRecurringExpenseEntriesUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

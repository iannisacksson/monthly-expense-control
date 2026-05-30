import { ListRecurringExpensesUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listRecurringExpensesUseCase = new ListRecurringExpensesUseCase()

export async function listRecurringExpensesByUserController(
  request: AuthenticatedHttpRequest,
): Promise<HttpResponse<unknown>> {
  const result = await listRecurringExpensesUseCase.execute(request.userId)
  return { statusCode: 200, body: result }
}

import { ListRecurringIncomeEntriesUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listRecurringIncomeEntriesUseCase = new ListRecurringIncomeEntriesUseCase()

export async function getMonthlyIncomesByRecurringIncomeController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listRecurringIncomeEntriesUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

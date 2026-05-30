import { ListMonthlyIncomesUseCase } from "../../../../application/use-cases/monthly-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listMonthlyIncomesUseCase = new ListMonthlyIncomesUseCase()

export async function listIncomesByMonthController(
  request: AuthenticatedHttpRequest<unknown, { monthId: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listMonthlyIncomesUseCase.execute(request.params.monthId, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

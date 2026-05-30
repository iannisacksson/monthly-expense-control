import { GetMonthlyIncomeByIdUseCase } from "../../../../application/use-cases/monthly-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getMonthlyIncomeByIdUseCase = new GetMonthlyIncomeByIdUseCase()

export async function getIncomeByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getMonthlyIncomeByIdUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

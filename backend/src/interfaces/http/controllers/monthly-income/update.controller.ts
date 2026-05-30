import type { UpdateMonthlyIncomeDTO } from "../../../../dtos/monthly-income.dto"
import { UpdateMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateMonthlyIncomeUseCase = new UpdateMonthlyIncomeUseCase()

export async function updateIncomeController(
  request: AuthenticatedHttpRequest<UpdateMonthlyIncomeDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateMonthlyIncomeUseCase.execute(request.params.id, request.body, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

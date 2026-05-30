import { DeleteMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteMonthlyIncomeUseCase = new DeleteMonthlyIncomeUseCase()

export async function deleteIncomeController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteMonthlyIncomeUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: { success: true },
  }
}

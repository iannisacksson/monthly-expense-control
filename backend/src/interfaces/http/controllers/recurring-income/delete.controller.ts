import { DeleteRecurringIncomeUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteRecurringIncomeUseCase = new DeleteRecurringIncomeUseCase()

export async function deleteRecurringIncomeController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteRecurringIncomeUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: { success: true } }
}

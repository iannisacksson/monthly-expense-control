import { DeleteExpenseUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteExpenseUseCase = new DeleteExpenseUseCase()

export async function deleteExpenseController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteExpenseUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: { success: true } }
}

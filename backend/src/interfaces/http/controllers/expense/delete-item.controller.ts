import { DeleteExpenseItemUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteExpenseItemUseCase = new DeleteExpenseItemUseCase()

export async function deleteExpenseItemController(
  request: AuthenticatedHttpRequest<unknown, { itemId: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteExpenseItemUseCase.execute(request.params.itemId, request.userId)
  return { statusCode: 200, body: { success: true } }
}

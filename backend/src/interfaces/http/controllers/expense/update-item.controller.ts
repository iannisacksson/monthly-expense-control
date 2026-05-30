import type { UpdateExpenseItemDTO } from "../../../../dtos/expense-item.dto"
import { UpdateExpenseItemUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateExpenseItemUseCase = new UpdateExpenseItemUseCase()

export async function updateExpenseItemController(
  request: AuthenticatedHttpRequest<UpdateExpenseItemDTO, { itemId: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateExpenseItemUseCase.execute(request.params.itemId, request.body, request.userId)
  return { statusCode: 200, body: result }
}

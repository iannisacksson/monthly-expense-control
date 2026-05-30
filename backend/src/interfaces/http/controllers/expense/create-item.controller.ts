import type { CreateExpenseItemDTO } from "../../../../dtos/expense-item.dto"
import { CreateExpenseItemUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createExpenseItemUseCase = new CreateExpenseItemUseCase()

export async function createExpenseItemController(
  request: AuthenticatedHttpRequest<CreateExpenseItemDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await createExpenseItemUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 201, body: result }
}

import type { UpdateExpenseDTO } from "../../../../dtos/expense.dto"
import { UpdateExpenseUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateExpenseUseCase = new UpdateExpenseUseCase()

export async function updateExpenseController(
  request: AuthenticatedHttpRequest<UpdateExpenseDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateExpenseUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 200, body: result }
}

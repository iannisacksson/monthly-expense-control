import type { CreateExpenseDTO } from "../../../../dtos/expense.dto"
import { CreateExpenseUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createExpenseUseCase = new CreateExpenseUseCase()

export async function createExpenseController(
  request: AuthenticatedHttpRequest<CreateExpenseDTO>,
): Promise<HttpResponse<unknown>> {
  const { user_id: _ignored, ...body } = request.body
  const result = await createExpenseUseCase.execute({
    ...body,
    user_id: request.userId,
  })
  return { statusCode: 201, body: result }
}

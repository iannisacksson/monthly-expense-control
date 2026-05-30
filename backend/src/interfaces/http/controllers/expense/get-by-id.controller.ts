import { GetExpenseByIdUseCase } from "../../../../application/use-cases/expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getExpenseByIdUseCase = new GetExpenseByIdUseCase()

export async function getExpenseByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getExpenseByIdUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

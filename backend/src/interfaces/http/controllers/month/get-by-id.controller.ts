import { GetMonthByIdUseCase } from "../../../../application/use-cases/month.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getMonthByIdUseCase = new GetMonthByIdUseCase()

export async function getMonthByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getMonthByIdUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

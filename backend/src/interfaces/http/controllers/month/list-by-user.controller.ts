import { ListMonthsUseCase } from "../../../../application/use-cases/month.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listMonthsUseCase = new ListMonthsUseCase()

export async function listMonthsByUserController(
  request: AuthenticatedHttpRequest,
): Promise<HttpResponse<unknown>> {
  const result = await listMonthsUseCase.execute(request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

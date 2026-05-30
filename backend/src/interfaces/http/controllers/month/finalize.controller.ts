import { FinalizeMonthUseCase } from "../../../../application/use-cases/month.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const finalizeMonthUseCase = new FinalizeMonthUseCase()

export async function finalizeMonthController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await finalizeMonthUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

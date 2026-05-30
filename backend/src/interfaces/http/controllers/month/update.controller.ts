import { UpdateMonthUseCase } from "../../../../application/use-cases/month.use-cases"
import type { UpdateMonthDTO } from "../../../../dtos/month.dto"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateMonthUseCase = new UpdateMonthUseCase()

export async function updateMonthController(
  request: AuthenticatedHttpRequest<UpdateMonthDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateMonthUseCase.execute(request.params.id, request.body, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

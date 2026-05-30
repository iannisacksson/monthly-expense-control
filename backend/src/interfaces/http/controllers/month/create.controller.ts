import type { CreateMonthDTO, UpdateMonthDTO } from "../../../../dtos/month.dto"
import { CreateMonthUseCase } from "../../../../application/use-cases/month.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createMonthUseCase = new CreateMonthUseCase()

export async function createMonthController(
  request: AuthenticatedHttpRequest<CreateMonthDTO>,
): Promise<HttpResponse<unknown>> {
  const { user_id: _ignored, ...body } = request.body
  const result = await createMonthUseCase.execute({
    ...body,
    user_id: request.userId,
  })

  return {
    statusCode: 201,
    body: result,
  }
}

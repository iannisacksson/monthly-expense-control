import { GetUserByIdUseCase } from "../../../../application/use-cases/user.use-cases"
import type { HttpRequest, HttpResponse } from "../../http.types"

const getUserByIdUseCase = new GetUserByIdUseCase()

export async function getUserByIdController(
  request: HttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getUserByIdUseCase.execute(request.params.id)

  return {
    statusCode: 200,
    body: result,
  }
}

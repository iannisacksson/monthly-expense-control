import { GetAuthenticatedProfileUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getAuthenticatedProfileUseCase = new GetAuthenticatedProfileUseCase()

export async function getMeController(
  request: AuthenticatedHttpRequest,
): Promise<HttpResponse<unknown>> {
  const user = await getAuthenticatedProfileUseCase.execute(request.userId)

  return {
    statusCode: 200,
    body: user,
  }
}

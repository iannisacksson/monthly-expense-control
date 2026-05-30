import type { UpdateProfileDTO } from "../../../../dtos/auth.dto"
import { UpdateAuthenticatedProfileUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateAuthenticatedProfileUseCase = new UpdateAuthenticatedProfileUseCase()

export async function updateMeController(
  request: AuthenticatedHttpRequest<UpdateProfileDTO>,
): Promise<HttpResponse<unknown>> {
  const { name, email, password } = request.body
  const user = await updateAuthenticatedProfileUseCase.execute(request.userId, {
    name,
    email,
    password,
  })

  return {
    statusCode: 200,
    body: user,
  }
}

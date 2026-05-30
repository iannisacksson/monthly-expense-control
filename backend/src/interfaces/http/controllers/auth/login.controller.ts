import type { LoginDTO } from "../../../../dtos/auth.dto"
import { LoginUserUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthRequestContext } from "../../../../utils/request-context"
import type { HttpRequest, HttpResponse } from "../../http.types"

const loginUserUseCase = new LoginUserUseCase()

export async function loginController(
  request: HttpRequest<LoginDTO> & { context: AuthRequestContext },
): Promise<HttpResponse<{ user: unknown }>> {
  const { email, password } = request.body
  const result = await loginUserUseCase.execute({ email, password }, request.context)

  return {
    statusCode: 200,
    body: { user: result.user },
    authCookies: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  }
}

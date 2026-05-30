import { LogoutUserUseCase, ReadSessionIdFromAccessTokenUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthRequestContext } from "../../../../utils/request-context"
import type { HttpRequest, HttpResponse } from "../../http.types"

const logoutUserUseCase = new LogoutUserUseCase()
const readSessionIdFromAccessTokenUseCase = new ReadSessionIdFromAccessTokenUseCase()

export async function logoutController(
  request: HttpRequest & { refreshToken: string | null; accessToken: string | null; context: AuthRequestContext },
): Promise<HttpResponse<{ success: boolean }>> {
  const sessionId = request.accessToken
    ? readSessionIdFromAccessTokenUseCase.execute(request.accessToken)
    : null

  await logoutUserUseCase.execute(request.refreshToken, sessionId, request.context)

  return {
    statusCode: 200,
    body: { success: true },
    clearAuthCookies: true,
  }
}

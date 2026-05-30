import { RefreshSessionUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthRequestContext } from "../../../../utils/request-context"
import { UnauthorizedError } from "../../../../utils/errors"
import type { HttpRequest, HttpResponse } from "../../http.types"

const refreshSessionUseCase = new RefreshSessionUseCase()

export async function refreshController(
  request: HttpRequest & { refreshToken: string | null; context: AuthRequestContext },
): Promise<HttpResponse<{ user: unknown }>> {
  if (!request.refreshToken) {
    throw new UnauthorizedError("Missing refresh cookie")
  }

  const result = await refreshSessionUseCase.execute(request.refreshToken, request.context)

  return {
    statusCode: 200,
    body: { user: result.user },
    authCookies: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  }
}

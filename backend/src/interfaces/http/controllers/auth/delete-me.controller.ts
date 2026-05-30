import { DeleteAuthenticatedProfileUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteAuthenticatedProfileUseCase = new DeleteAuthenticatedProfileUseCase()

export async function deleteMeController(
  request: AuthenticatedHttpRequest,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteAuthenticatedProfileUseCase.execute(request.userId)

  return {
    statusCode: 200,
    body: { success: true },
    clearAuthCookies: true,
  }
}

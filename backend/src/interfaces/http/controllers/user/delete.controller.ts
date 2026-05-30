import { DeleteUserUseCase } from "../../../../application/use-cases/user.use-cases"
import type { HttpRequest, HttpResponse } from "../../http.types"

const deleteUserUseCase = new DeleteUserUseCase()

export async function deleteUserController(
  request: HttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteUserUseCase.execute(request.params.id)

  return {
    statusCode: 200,
    body: { success: true },
  }
}

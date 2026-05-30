import { UpdateUserUseCase } from "../../../../application/use-cases/user.use-cases"
import type { UpdateUserDTO } from "../../../../dtos/user.dto"
import type { HttpRequest, HttpResponse } from "../../http.types"

const updateUserUseCase = new UpdateUserUseCase()

export async function updateUserController(
  request: HttpRequest<UpdateUserDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateUserUseCase.execute(request.params.id, request.body)

  return {
    statusCode: 200,
    body: result,
  }
}

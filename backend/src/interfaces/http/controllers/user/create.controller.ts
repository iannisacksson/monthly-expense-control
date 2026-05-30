import { CreateUserUseCase } from "../../../../application/use-cases/user.use-cases"
import type { CreateUserDTO, UpdateUserDTO } from "../../../../dtos/user.dto"
import type { HttpRequest, HttpResponse } from "../../http.types"

const createUserUseCase = new CreateUserUseCase()

export async function createUserController(
  request: HttpRequest<CreateUserDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await createUserUseCase.execute(request.body)

  return {
    statusCode: 201,
    body: result,
  }
}

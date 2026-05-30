import type { RegisterDTO } from "../../../../dtos/auth.dto"
import { RegisterUserUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { HttpRequest, HttpResponse } from "../../http.types"

const registerUserUseCase = new RegisterUserUseCase()

export async function registerController(
  request: HttpRequest<RegisterDTO>,
): Promise<HttpResponse<unknown>> {
  const { name, email, password } = request.body
  const user = await registerUserUseCase.execute({ name, email, password })

  return {
    statusCode: 201,
    body: user,
  }
}

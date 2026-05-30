import type { RegisterDTO } from "../../../../dtos/auth.dto"
import { RegisterUserUseCase } from "../../../../application/use-cases/auth.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class RegisterController implements IController<
  HttpRequest<RegisterDTO>
> {
  constructor(private readonly useCase: RegisterUserUseCase) {}

  async handle(request: HttpRequest<RegisterDTO>): Promise<HttpResponse> {
    const { name, email, password } = request.body;
    const user = await this.useCase.execute({ name, email, password });

    return {
      statusCode: HttpStatusCode.CREATED,
      body: user,
    };
  }
}

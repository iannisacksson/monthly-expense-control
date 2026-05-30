import type { CreateUserDTO } from "../../../../dtos/user.dto";
import { CreateUserUseCase } from "../../../../application/use-cases/user/create.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class CreateUserController implements IController<
  HttpRequest<CreateUserDTO>
> {
  constructor(private readonly useCase: CreateUserUseCase) {}

  async handle(request: HttpRequest<CreateUserDTO>): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body);

    return {
      statusCode: HttpStatusCode.CREATED,
      body: result,
    };
  }
}

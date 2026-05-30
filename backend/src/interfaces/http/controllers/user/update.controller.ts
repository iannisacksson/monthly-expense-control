import type { UpdateUserDTO } from "../../../../dtos/user.dto";
import { UpdateUserUseCase } from "../../../../application/use-cases/user/update.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class UpdateUserController implements IController<
  HttpRequest<UpdateUserDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateUserUseCase) {}

  async handle(
    request: HttpRequest<UpdateUserDTO, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.params.id, request.body);

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

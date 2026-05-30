import { GetUserByIdUseCase } from "../../../../application/use-cases/user.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class GetUserByIdController implements IController<
  HttpRequest<unknown, { id: string }>
> {
  constructor(private readonly useCase: GetUserByIdUseCase) {}

  async handle(
    request: HttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.params.id);

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

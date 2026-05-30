import { DeleteUserUseCase } from "../../../../application/use-cases/user/delete.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class DeleteUserController implements IController<
  HttpRequest<unknown, { id: string }>,
  { success: boolean }
> {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  async handle(
    request: HttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse<{ success: boolean }>> {
    await this.useCase.execute(request.params.id);

    return {
      statusCode: HttpStatusCode.OK,
      body: { success: true },
    };
  }
}

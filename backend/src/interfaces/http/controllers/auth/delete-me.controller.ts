import { DeleteAuthenticatedProfileUseCase } from "../../../../application/use-cases/auth.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class DeleteMeController implements IController<
  AuthenticatedHttpRequest,
  { success: boolean }
> {
  constructor(private readonly useCase: DeleteAuthenticatedProfileUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest,
  ): Promise<HttpResponse<{ success: boolean }>> {
    await this.useCase.execute(request.userId);

    return {
      statusCode: HttpStatusCode.OK,
      body: { success: true },
      clearAuthCookies: true,
    };
  }
}

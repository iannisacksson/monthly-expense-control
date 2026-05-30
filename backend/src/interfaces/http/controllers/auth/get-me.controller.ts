import { GetAuthenticatedProfileUseCase } from "../../../../application/use-cases/auth.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class GetMeController implements IController<AuthenticatedHttpRequest> {
  constructor(private readonly useCase: GetAuthenticatedProfileUseCase) {}

  async handle(request: AuthenticatedHttpRequest): Promise<HttpResponse> {
    const user = await this.useCase.execute(request.userId);

    return {
      statusCode: HttpStatusCode.OK,
      body: user,
    };
  }
}

import type { LoginDTO } from "../../../../dtos/auth.dto"
import { LoginUserUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthRequestContext } from "../../../../utils/request-context"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

type LoginRequest = HttpRequest<LoginDTO> & { context: AuthRequestContext };

export class LoginController implements IController<
  LoginRequest,
  { user: unknown }
> {
  constructor(private readonly useCase: LoginUserUseCase) {}

  async handle(
    request: LoginRequest,
  ): Promise<HttpResponse<{ user: unknown }>> {
    const { email, password } = request.body;
    const result = await this.useCase.execute(
      { email, password },
      request.context,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: { user: result.user },
      authCookies: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }
}

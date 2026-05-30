import { LogoutUserUseCase, ReadSessionIdFromAccessTokenUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthRequestContext } from "../../../../utils/request-context"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

type LogoutRequest = HttpRequest & {
  refreshToken: string | null;
  accessToken: string | null;
  context: AuthRequestContext;
};

export class LogoutController implements IController<
  LogoutRequest,
  { success: boolean }
> {
  constructor(
    private readonly logoutUseCase: LogoutUserUseCase,
    private readonly readSessionIdUseCase: ReadSessionIdFromAccessTokenUseCase,
  ) {}

  async handle(
    request: LogoutRequest,
  ): Promise<HttpResponse<{ success: boolean }>> {
    const sessionId = request.accessToken
      ? this.readSessionIdUseCase.execute(request.accessToken)
      : null;

    await this.logoutUseCase.execute(
      request.refreshToken,
      sessionId,
      request.context,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: { success: true },
      clearAuthCookies: true,
    };
  }
}

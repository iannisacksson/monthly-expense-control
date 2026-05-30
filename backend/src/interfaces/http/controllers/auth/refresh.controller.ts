import { RefreshSessionUseCase } from "../../../../application/use-cases/auth.use-cases"
import type { AuthRequestContext } from "../../../../utils/request-context"
import { UnauthorizedError } from "../../../../utils/errors"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

type RefreshRequest = HttpRequest & {
  refreshToken: string | null;
  context: AuthRequestContext;
};

export class RefreshController implements IController<
  RefreshRequest,
  { user: unknown }
> {
  constructor(private readonly useCase: RefreshSessionUseCase) {}

  async handle(
    request: RefreshRequest,
  ): Promise<HttpResponse<{ user: unknown }>> {
    if (!request.refreshToken) {
      throw new UnauthorizedError("Missing refresh cookie");
    }

    const result = await this.useCase.execute(
      request.refreshToken,
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

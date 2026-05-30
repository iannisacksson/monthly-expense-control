import { GetMonthByIdUseCase } from "../../../../application/use-cases/month.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class GetMonthByIdController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>
> {
  constructor(private readonly useCase: GetMonthByIdUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

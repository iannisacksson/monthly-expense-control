import { ListMonthsUseCase } from "../../../../application/use-cases/month.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListMonthsByUserController implements IController<AuthenticatedHttpRequest> {
  constructor(private readonly useCase: ListMonthsUseCase) {}

  async handle(request: AuthenticatedHttpRequest): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.userId);

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

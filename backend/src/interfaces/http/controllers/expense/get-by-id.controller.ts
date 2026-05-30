import { GetExpenseByIdUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class GetExpenseByIdController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>
> {
  constructor(private readonly useCase: GetExpenseByIdUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

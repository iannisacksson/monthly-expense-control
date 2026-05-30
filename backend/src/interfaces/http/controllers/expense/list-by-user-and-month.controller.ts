import { ListExpensesByMonthUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListExpensesByUserAndMonthController implements IController<
  AuthenticatedHttpRequest<unknown, { userId: string; monthId: string }>
> {
  constructor(private readonly useCase: ListExpensesByMonthUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<
      unknown,
      { userId: string; monthId: string }
    >,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.userId,
      request.params.monthId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

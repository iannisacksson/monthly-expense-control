import { ListMonthlyIncomesUseCase } from "../../../../application/use-cases/monthly-income.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListMonthlyIncomesByMonthController implements IController<
  AuthenticatedHttpRequest<unknown, { monthId: string }>
> {
  constructor(private readonly useCase: ListMonthlyIncomesUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { monthId: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.monthId,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

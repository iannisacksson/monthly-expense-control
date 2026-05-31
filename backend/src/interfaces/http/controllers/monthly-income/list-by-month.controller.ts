import { ListMonthlyIncomesByMonthUseCase } from "../../../../application/use-cases/monthly-income/list-by-month.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { serializeMonthlyIncome } from "./monthly-income.serializer";

export class ListMonthlyIncomesByMonthController implements IController<
  AuthenticatedHttpRequest<unknown, { monthId: string }>
> {
  constructor(private readonly useCase: ListMonthlyIncomesByMonthUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { monthId: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.monthId,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: result.map(serializeMonthlyIncome),
    };
  }
}

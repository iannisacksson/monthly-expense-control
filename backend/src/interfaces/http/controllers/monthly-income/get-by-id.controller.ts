import { GetMonthlyIncomeByIdUseCase } from "../../../../application/use-cases/monthly-income/get-by-id.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { serializeMonthlyIncome } from "./monthly-income.serializer";

export class GetMonthlyIncomeByIdController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>
> {
  constructor(private readonly useCase: GetMonthlyIncomeByIdUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: serializeMonthlyIncome(result),
    };
  }
}

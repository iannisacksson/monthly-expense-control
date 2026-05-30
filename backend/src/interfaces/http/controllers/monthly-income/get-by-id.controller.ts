import { GetMonthlyIncomeByIdUseCase } from "../../../../application/use-cases/monthly-income.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

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
      body: result,
    };
  }
}

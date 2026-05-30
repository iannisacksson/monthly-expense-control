import { ListIncomeTaxesUseCase } from "../../../../application/use-cases/income-tax.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListIncomeTaxesByIncomeController implements IController<
  AuthenticatedHttpRequest<unknown, { incomeId: string }>
> {
  constructor(private readonly useCase: ListIncomeTaxesUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { incomeId: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.incomeId,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

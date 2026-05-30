import { ListIncomeTaxesByIncomeUseCase } from "../../../../application/use-cases/income-tax/list-by-income.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListIncomeTaxesByIncomeController implements IController<
  AuthenticatedHttpRequest<unknown, { incomeId: string }>
> {
  constructor(private readonly useCase: ListIncomeTaxesByIncomeUseCase) {}

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

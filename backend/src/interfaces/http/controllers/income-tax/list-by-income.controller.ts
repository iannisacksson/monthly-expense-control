import { ListIncomeTaxesByIncomeUseCase } from "../../../../application/use-cases/income-tax/list-by-income.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import {
  IncomeTaxResponse,
  toIncomeTaxResponse,
} from "./income-tax.response";

export class ListIncomeTaxesByIncomeController implements IController<
  AuthenticatedHttpRequest<unknown, { incomeId: string }>,
  IncomeTaxResponse[]
> {
  constructor(private readonly useCase: ListIncomeTaxesByIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { incomeId: string }>,
  ): Promise<HttpResponse<IncomeTaxResponse[]>> {
    const result = await this.useCase.execute(
      request.params.incomeId,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: result.map(toIncomeTaxResponse),
    };
  }
}

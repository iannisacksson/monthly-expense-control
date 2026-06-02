import { GetIncomeTaxByIdUseCase } from "../../../../application/use-cases/income-tax/get-by-id.use-case";
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

export class GetIncomeTaxByIdController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>,
  IncomeTaxResponse
> {
  constructor(private readonly useCase: GetIncomeTaxByIdUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse<IncomeTaxResponse>> {
    const result = await this.useCase.execute(
      request.params.id,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: toIncomeTaxResponse(result),
    };
  }
}

import { GetLivenessUseCase } from "../../../../application/use-cases/operational.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class GetLivenessController implements IController<HttpRequest> {
  constructor(private readonly useCase: GetLivenessUseCase) {}

  async handle(_request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: HttpStatusCode.OK,
      body: this.useCase.execute(),
    };
  }
}

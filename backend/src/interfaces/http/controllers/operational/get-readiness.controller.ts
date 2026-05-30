import { GetReadinessUseCase } from "../../../../application/use-cases/operational.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class GetReadinessController implements IController<HttpRequest> {
  constructor(private readonly useCase: GetReadinessUseCase) {}

  async handle(_request: HttpRequest): Promise<HttpResponse> {
    const readiness = await this.useCase.execute();

    return {
      statusCode:
        readiness.status === "ok"
          ? HttpStatusCode.OK
          : HttpStatusCode.SERVICE_UNAVAILABLE,
      body: readiness,
    };
  }
}

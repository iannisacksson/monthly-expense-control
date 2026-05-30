import { GetHealthUseCase } from "../../../../application/use-cases/operational.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class GetHealthController implements IController<HttpRequest> {
  constructor(private readonly useCase: GetHealthUseCase) {}

  async handle(_request: HttpRequest): Promise<HttpResponse> {
    const health = await this.useCase.execute();

    return {
      statusCode:
        health.status === "ok"
          ? HttpStatusCode.OK
          : HttpStatusCode.SERVICE_UNAVAILABLE,
      body: health,
    };
  }
}

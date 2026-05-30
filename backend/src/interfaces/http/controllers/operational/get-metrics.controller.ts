import { metricsRegistry } from "../../../../utils/metrics"
import { HttpStatusCode } from "../../http-status-code";
import type { HttpRequest, HttpResponse, IController } from "../../http.types";

export class GetMetricsController implements IController<HttpRequest, string> {
  async handle(_request: HttpRequest): Promise<HttpResponse<string>> {
    return {
      statusCode: HttpStatusCode.OK,
      body: await metricsRegistry.metrics(),
      bodyType: "text",
      headers: {
        "Content-Type": metricsRegistry.contentType,
      },
    };
  }
}

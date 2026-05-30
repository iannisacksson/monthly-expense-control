import { metricsRegistry } from "../../../../utils/metrics"
import type { HttpRequest, HttpResponse } from "../../http.types"

export async function getMetricsController(
  _request: HttpRequest,
): Promise<HttpResponse<string>> {
  return {
    statusCode: 200,
    body: await metricsRegistry.metrics(),
    bodyType: "text",
    headers: {
      "Content-Type": metricsRegistry.contentType,
    },
  }
}

import { GetHealthUseCase } from "../../../../application/use-cases/operational.use-cases"
import type { HttpRequest, HttpResponse } from "../../http.types"

const getHealthUseCase = new GetHealthUseCase()

export async function getHealthController(
  _request: HttpRequest,
): Promise<HttpResponse<unknown>> {
  const health = await getHealthUseCase.execute()

  return {
    statusCode: health.status === "ok" ? 200 : 503,
    body: health,
  }
}

import { GetReadinessUseCase } from "../../../../application/use-cases/operational.use-cases"
import type { HttpRequest, HttpResponse } from "../../http.types"

const getReadinessUseCase = new GetReadinessUseCase()

export async function getReadinessController(
  _request: HttpRequest,
): Promise<HttpResponse<unknown>> {
  const readiness = await getReadinessUseCase.execute()

  return {
    statusCode: readiness.status === "ok" ? 200 : 503,
    body: readiness,
  }
}

import { GetLivenessUseCase } from "../../../../application/use-cases/operational.use-cases"
import type { HttpRequest, HttpResponse } from "../../http.types"

const getLivenessUseCase = new GetLivenessUseCase()

export async function getLivenessController(
  _request: HttpRequest,
): Promise<HttpResponse<unknown>> {
  return {
    statusCode: 200,
    body: getLivenessUseCase.execute(),
  }
}

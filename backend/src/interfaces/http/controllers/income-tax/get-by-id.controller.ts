import { GetIncomeTaxByIdUseCase } from "../../../../application/use-cases/income-tax.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getIncomeTaxByIdUseCase = new GetIncomeTaxByIdUseCase()

export async function getTaxByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getIncomeTaxByIdUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

import { GetInstallmentGroupByIdUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getInstallmentGroupByIdUseCase = new GetInstallmentGroupByIdUseCase()

export async function getInstallmentGroupByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getInstallmentGroupByIdUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

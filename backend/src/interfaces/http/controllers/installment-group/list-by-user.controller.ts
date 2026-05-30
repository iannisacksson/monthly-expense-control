import { ListInstallmentGroupsUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listInstallmentGroupsUseCase = new ListInstallmentGroupsUseCase()

export async function listInstallmentGroupsByUserController(
  request: AuthenticatedHttpRequest,
): Promise<HttpResponse<unknown>> {
  const result = await listInstallmentGroupsUseCase.execute(request.userId)
  return { statusCode: 200, body: result }
}

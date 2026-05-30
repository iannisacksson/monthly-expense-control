import type { UpdateInstallmentGroupDTO } from "../../../../dtos/installment-group.dto"
import { UpdateInstallmentGroupUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateInstallmentGroupUseCase = new UpdateInstallmentGroupUseCase()

export async function updateInstallmentGroupController(
  request: AuthenticatedHttpRequest<UpdateInstallmentGroupDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateInstallmentGroupUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 200, body: result }
}

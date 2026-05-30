import type { UpdateInstallmentGroupDTO } from "../../../../dtos/installment-group.dto"
import { DeleteInstallmentGroupUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteInstallmentGroupUseCase = new DeleteInstallmentGroupUseCase()

export async function deleteInstallmentGroupController(
  request: AuthenticatedHttpRequest<UpdateInstallmentGroupDTO, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteInstallmentGroupUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 200, body: { success: true } }
}

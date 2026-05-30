import type {
  CreateInstallmentGroupDTO,
} from "../../../../dtos/installment-group.dto"
import { CreateInstallmentGroupUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createInstallmentGroupUseCase = new CreateInstallmentGroupUseCase()

export async function createInstallmentPurchaseController(
  request: AuthenticatedHttpRequest<CreateInstallmentGroupDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await createInstallmentGroupUseCase.execute(request.body, request.userId)
  return { statusCode: 201, body: result }
}

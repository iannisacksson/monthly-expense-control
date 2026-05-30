import type { RestoreInstallmentOccurrenceDTO } from "../../../../dtos/installment-group.dto"
import { RestoreInstallmentOccurrenceUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const restoreInstallmentOccurrenceUseCase = new RestoreInstallmentOccurrenceUseCase()

export async function restoreInstallmentOccurrenceController(
  request: AuthenticatedHttpRequest<RestoreInstallmentOccurrenceDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await restoreInstallmentOccurrenceUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 201, body: result }
}

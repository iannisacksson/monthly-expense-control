import { DeleteIncomeTaxUseCase } from "../../../../application/use-cases/income-tax.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteIncomeTaxUseCase = new DeleteIncomeTaxUseCase()

export async function deleteTaxController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteIncomeTaxUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: { success: true },
  }
}

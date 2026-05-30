import { UpdateIncomeTaxUseCase } from "../../../../application/use-cases/income-tax.use-cases"
import type { UpdateIncomeTaxDTO } from "../../../../dtos/income-tax.dto"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateIncomeTaxUseCase = new UpdateIncomeTaxUseCase()

export async function updateTaxController(
  request: AuthenticatedHttpRequest<UpdateIncomeTaxDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateIncomeTaxUseCase.execute(request.params.id, request.body, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

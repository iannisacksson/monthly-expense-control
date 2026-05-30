import type { CreateIncomeTaxDTO, UpdateIncomeTaxDTO } from "../../../../dtos/income-tax.dto"
import { CreateIncomeTaxUseCase } from "../../../../application/use-cases/income-tax.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createIncomeTaxUseCase = new CreateIncomeTaxUseCase()

export async function createTaxController(
  request: AuthenticatedHttpRequest<CreateIncomeTaxDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await createIncomeTaxUseCase.execute(request.body, request.userId)

  return {
    statusCode: 201,
    body: result,
  }
}

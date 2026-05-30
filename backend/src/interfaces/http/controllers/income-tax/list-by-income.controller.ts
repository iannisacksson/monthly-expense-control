import { ListIncomeTaxesUseCase } from "../../../../application/use-cases/income-tax.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listIncomeTaxesUseCase = new ListIncomeTaxesUseCase()

export async function listTaxesByIncomeController(
  request: AuthenticatedHttpRequest<unknown, { incomeId: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listIncomeTaxesUseCase.execute(request.params.incomeId, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

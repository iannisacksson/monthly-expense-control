import { ListInstallmentGroupExpensesUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listInstallmentGroupExpensesUseCase = new ListInstallmentGroupExpensesUseCase()

export async function getExpensesByInstallmentGroupController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listInstallmentGroupExpensesUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

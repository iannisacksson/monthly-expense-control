import { DeleteBudgetRuleUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteBudgetRuleUseCase = new DeleteBudgetRuleUseCase()

export async function deleteBudgetRuleController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteBudgetRuleUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: { success: true } }
}

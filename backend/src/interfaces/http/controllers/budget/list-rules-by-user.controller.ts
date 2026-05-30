import { ListBudgetRulesUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listBudgetRulesUseCase = new ListBudgetRulesUseCase()

export async function listBudgetRulesByUserController(
  request: AuthenticatedHttpRequest,
): Promise<HttpResponse<unknown>> {
  const result = await listBudgetRulesUseCase.execute(request.userId)
  return { statusCode: 200, body: result }
}

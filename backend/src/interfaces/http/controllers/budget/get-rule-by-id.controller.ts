import { GetBudgetRuleByIdUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getBudgetRuleByIdUseCase = new GetBudgetRuleByIdUseCase()

export async function getBudgetRuleByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getBudgetRuleByIdUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: result }
}

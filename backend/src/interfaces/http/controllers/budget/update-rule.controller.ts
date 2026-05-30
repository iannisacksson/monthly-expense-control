import type { UpdateBudgetRuleDTO } from "../../../../dtos/budget-rule.dto"
import { UpdateBudgetRuleUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateBudgetRuleUseCase = new UpdateBudgetRuleUseCase()

export async function updateBudgetRuleController(
  request: AuthenticatedHttpRequest<UpdateBudgetRuleDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateBudgetRuleUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 200, body: result }
}

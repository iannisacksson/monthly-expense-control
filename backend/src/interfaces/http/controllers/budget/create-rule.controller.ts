import type { CreateBudgetRuleDTO } from "../../../../dtos/budget-rule.dto"
import { CreateBudgetRuleUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createBudgetRuleUseCase = new CreateBudgetRuleUseCase()

export async function createBudgetRuleController(
  request: AuthenticatedHttpRequest<CreateBudgetRuleDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await createBudgetRuleUseCase.execute(request.body, request.userId)

  return { statusCode: 201, body: result }
}

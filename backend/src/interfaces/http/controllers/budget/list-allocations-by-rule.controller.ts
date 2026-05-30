import { ListBudgetAllocationsUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listBudgetAllocationsUseCase = new ListBudgetAllocationsUseCase()

export async function listAllocationsByRuleController(
  request: AuthenticatedHttpRequest<unknown, { ruleId: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listBudgetAllocationsUseCase.execute(request.params.ruleId, request.userId)
  return { statusCode: 200, body: result }
}

import type { UpdateBudgetAllocationDTO } from "../../../../dtos/budget-allocation.dto"
import { UpdateBudgetAllocationUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateBudgetAllocationUseCase = new UpdateBudgetAllocationUseCase()

export async function updateAllocationController(
  request: AuthenticatedHttpRequest<UpdateBudgetAllocationDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateBudgetAllocationUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 200, body: result }
}

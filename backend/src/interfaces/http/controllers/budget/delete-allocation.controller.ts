import { DeleteBudgetAllocationUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteBudgetAllocationUseCase = new DeleteBudgetAllocationUseCase()

export async function deleteAllocationController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteBudgetAllocationUseCase.execute(request.params.id, request.userId)
  return { statusCode: 200, body: { success: true } }
}

import type { CreateBudgetAllocationDTO } from "../../../../dtos/budget-allocation.dto"
import { CreateBudgetAllocationUseCase } from "../../../../application/use-cases/budget.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createBudgetAllocationUseCase = new CreateBudgetAllocationUseCase()

export async function createAllocationController(
  request: AuthenticatedHttpRequest<CreateBudgetAllocationDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await createBudgetAllocationUseCase.execute(request.body, request.userId)
  return { statusCode: 201, body: result }
}

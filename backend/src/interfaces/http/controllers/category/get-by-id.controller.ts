import { GetCategoryByIdUseCase } from "../../../../application/use-cases/category.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getCategoryByIdUseCase = new GetCategoryByIdUseCase()

export async function getCategoryByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getCategoryByIdUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

import { GetSubcategoryByIdUseCase } from "../../../../application/use-cases/subcategory.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const getSubcategoryByIdUseCase = new GetSubcategoryByIdUseCase()

export async function getSubcategoryByIdController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await getSubcategoryByIdUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

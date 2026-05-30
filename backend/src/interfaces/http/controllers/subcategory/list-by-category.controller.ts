import { ListSubcategoriesUseCase } from "../../../../application/use-cases/subcategory.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listSubcategoriesUseCase = new ListSubcategoriesUseCase()

export async function listSubcategoriesByCategoryController(
  request: AuthenticatedHttpRequest<unknown, { categoryId: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await listSubcategoriesUseCase.execute(request.params.categoryId, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

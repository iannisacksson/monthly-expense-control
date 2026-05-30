import { ListCategoriesUseCase } from "../../../../application/use-cases/category.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const listCategoriesUseCase = new ListCategoriesUseCase()

export async function listCategoriesByUserController(
  request: AuthenticatedHttpRequest,
): Promise<HttpResponse<unknown>> {
  const result = await listCategoriesUseCase.execute(request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

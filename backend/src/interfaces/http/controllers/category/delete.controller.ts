import { DeleteCategoryUseCase } from "../../../../application/use-cases/category.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteCategoryUseCase = new DeleteCategoryUseCase()

export async function deleteCategoryController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteCategoryUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: { success: true },
  }
}

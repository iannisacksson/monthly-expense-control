import { DeleteSubcategoryUseCase } from "../../../../application/use-cases/subcategory.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteSubcategoryUseCase = new DeleteSubcategoryUseCase()

export async function deleteSubcategoryController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteSubcategoryUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: { success: true },
  }
}

import type { UpdateCategoryDTO } from "../../../../dtos/category.dto"
import { UpdateCategoryUseCase } from "../../../../application/use-cases/category.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateCategoryUseCase = new UpdateCategoryUseCase()

export async function updateCategoryController(
  request: AuthenticatedHttpRequest<UpdateCategoryDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateCategoryUseCase.execute(request.params.id, request.body, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

import type { UpdateSubcategoryDTO } from "../../../../dtos/subcategory.dto"
import { UpdateSubcategoryUseCase } from "../../../../application/use-cases/subcategory.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateSubcategoryUseCase = new UpdateSubcategoryUseCase()

export async function updateSubcategoryController(
  request: AuthenticatedHttpRequest<UpdateSubcategoryDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateSubcategoryUseCase.execute(request.params.id, request.body, request.userId)

  return {
    statusCode: 200,
    body: result,
  }
}

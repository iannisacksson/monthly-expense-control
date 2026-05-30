import type { CreateSubcategoryDTO, UpdateSubcategoryDTO } from "../../../../dtos/subcategory.dto"
import { CreateSubcategoryUseCase } from "../../../../application/use-cases/subcategory.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createSubcategoryUseCase = new CreateSubcategoryUseCase()

export async function createSubcategoryController(
  request: AuthenticatedHttpRequest<CreateSubcategoryDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await createSubcategoryUseCase.execute(request.body, request.userId)

  return {
    statusCode: 201,
    body: result,
  }
}

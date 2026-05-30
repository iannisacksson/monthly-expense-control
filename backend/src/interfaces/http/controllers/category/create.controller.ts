import type { CreateCategoryDTO } from "../../../../dtos/category.dto"
import { CreateCategoryUseCase } from "../../../../application/use-cases/category.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createCategoryUseCase = new CreateCategoryUseCase()

export async function createCategoryController(
  request: AuthenticatedHttpRequest<CreateCategoryDTO>,
): Promise<HttpResponse<unknown>> {
  const { user_id: _ignored, ...body } = request.body
  const result = await createCategoryUseCase.execute({
    ...body,
    user_id: request.userId,
  })

  return {
    statusCode: 201,
    body: result,
  }
}

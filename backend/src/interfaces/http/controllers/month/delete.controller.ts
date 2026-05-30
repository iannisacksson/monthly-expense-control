import { DeleteMonthUseCase } from "../../../../application/use-cases/month.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteMonthUseCase = new DeleteMonthUseCase()

export async function deleteMonthController(
  request: AuthenticatedHttpRequest<unknown, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteMonthUseCase.execute(request.params.id, request.userId)

  return {
    statusCode: 200,
    body: { success: true },
  }
}

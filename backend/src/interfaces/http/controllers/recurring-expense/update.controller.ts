import type { UpdateRecurringExpenseDTO } from "../../../../dtos/recurring-expense.dto"
import { UpdateRecurringExpenseUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const updateRecurringExpenseUseCase = new UpdateRecurringExpenseUseCase()

export async function updateRecurringExpenseController(
  request: AuthenticatedHttpRequest<UpdateRecurringExpenseDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await updateRecurringExpenseUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 200, body: result }
}

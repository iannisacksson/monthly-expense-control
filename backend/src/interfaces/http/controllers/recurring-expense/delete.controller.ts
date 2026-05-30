import type { UpdateRecurringExpenseDTO } from "../../../../dtos/recurring-expense.dto"
import { DeleteRecurringExpenseUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const deleteRecurringExpenseUseCase = new DeleteRecurringExpenseUseCase()

export async function deleteRecurringExpenseController(
  request: AuthenticatedHttpRequest<UpdateRecurringExpenseDTO, { id: string }>,
): Promise<HttpResponse<{ success: boolean }>> {
  await deleteRecurringExpenseUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 200, body: { success: true } }
}

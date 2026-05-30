import type { RestoreRecurringExpenseOccurrenceDTO } from "../../../../dtos/recurring-expense.dto"
import { RestoreRecurringExpenseOccurrenceUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const restoreRecurringExpenseOccurrenceUseCase = new RestoreRecurringExpenseOccurrenceUseCase()

export async function restoreRecurringExpenseOccurrenceController(
  request: AuthenticatedHttpRequest<RestoreRecurringExpenseOccurrenceDTO, { id: string }>,
): Promise<HttpResponse<unknown>> {
  const result = await restoreRecurringExpenseOccurrenceUseCase.execute(request.params.id, request.body, request.userId)
  return { statusCode: 201, body: result }
}

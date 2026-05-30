import type { CreateRecurringExpenseDTO } from "../../../../dtos/recurring-expense.dto"
import { CreateRecurringExpenseUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const createRecurringExpenseUseCase = new CreateRecurringExpenseUseCase()

export async function createRecurringExpenseController(
  request: AuthenticatedHttpRequest<CreateRecurringExpenseDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await createRecurringExpenseUseCase.execute(request.body, request.userId)
  return { statusCode: 201, body: result }
}

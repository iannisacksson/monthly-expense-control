import type { CreateMonthlyIncomeDTO, UpdateMonthlyIncomeDTO } from "../../../../dtos/monthly-income.dto"
import { RegisterMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income.use-cases"
import type { AuthenticatedHttpRequest, HttpResponse } from "../../http.types"

const registerMonthlyIncomeUseCase = new RegisterMonthlyIncomeUseCase()

export async function registerIncomeController(
  request: AuthenticatedHttpRequest<CreateMonthlyIncomeDTO>,
): Promise<HttpResponse<unknown>> {
  const result = await registerMonthlyIncomeUseCase.execute(request.body, request.userId)

  return {
    statusCode: 201,
    body: result,
  }
}

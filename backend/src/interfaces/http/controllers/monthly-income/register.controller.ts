import type { CreateMonthlyIncomeDTO } from "../../../../dtos/monthly-income.dto";
import { RegisterMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income/register.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { serializeMonthlyIncome } from "./monthly-income.serializer";

type RegisterBody = {
  month_id: string;
  recurring_income_id?: string;
  gross_income: number;
  income_type: string;
  notes?: string;
  taxation?: CreateMonthlyIncomeDTO["taxation"];
};

export class RegisterMonthlyIncomeController implements IController<
  AuthenticatedHttpRequest<RegisterBody>
> {
  constructor(private readonly useCase: RegisterMonthlyIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<RegisterBody>,
  ): Promise<HttpResponse> {
    const {
      month_id,
      recurring_income_id,
      gross_income,
      income_type,
      notes,
      taxation,
    } = request.body;

    const result = await this.useCase.execute(
      {
        userId: request.userId,
        monthId: month_id,
        recurringIncomeId: recurring_income_id,
        grossIncome: gross_income,
        incomeType: income_type,
        notes,
        taxation,
      },
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.CREATED,
      body: serializeMonthlyIncome(result),
    };
  }
}

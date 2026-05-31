import type { UpdateMonthlyIncomeDTO } from "../../../../dtos/monthly-income.dto";
import { UpdateMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income/update.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { serializeMonthlyIncome } from "./monthly-income.serializer";

type UpdateBody = {
  gross_income?: number;
  income_type?: string;
  notes?: string;
  taxation?: UpdateMonthlyIncomeDTO["taxation"];
};

export class UpdateMonthlyIncomeController implements IController<
  AuthenticatedHttpRequest<UpdateBody, { id: string }>
> {
  constructor(private readonly useCase: UpdateMonthlyIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateBody, { id: string }>,
  ): Promise<HttpResponse> {
    const { gross_income, income_type, notes, taxation } = request.body;

    const result = await this.useCase.execute(
      request.params.id,
      {
        grossIncome: gross_income,
        incomeType: income_type,
        notes,
        taxation,
      },
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: serializeMonthlyIncome(result),
    };
  }
}

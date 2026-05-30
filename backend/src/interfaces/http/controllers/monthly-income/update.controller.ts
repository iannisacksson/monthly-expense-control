import type { UpdateMonthlyIncomeDTO } from "../../../../dtos/monthly-income.dto"
import { UpdateMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateMonthlyIncomeController implements IController<
  AuthenticatedHttpRequest<UpdateMonthlyIncomeDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateMonthlyIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateMonthlyIncomeDTO, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

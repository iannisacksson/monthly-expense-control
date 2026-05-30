import type { CreateMonthlyIncomeDTO } from "../../../../dtos/monthly-income.dto";
import { RegisterMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income.use-cases";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class RegisterMonthlyIncomeController implements IController<
  AuthenticatedHttpRequest<CreateMonthlyIncomeDTO>
> {
  constructor(private readonly useCase: RegisterMonthlyIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateMonthlyIncomeDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);

    return {
      statusCode: HttpStatusCode.CREATED,
      body: result,
    };
  }
}

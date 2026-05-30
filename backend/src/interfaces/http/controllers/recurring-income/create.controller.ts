import type { CreateRecurringIncomeDTO } from "../../../../dtos/recurring-income.dto"
import { CreateRecurringIncomeUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateRecurringIncomeController implements IController<
  AuthenticatedHttpRequest<CreateRecurringIncomeDTO>
> {
  constructor(private readonly useCase: CreateRecurringIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateRecurringIncomeDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);
    return { statusCode: HttpStatusCode.CREATED, body: result };
  }
}

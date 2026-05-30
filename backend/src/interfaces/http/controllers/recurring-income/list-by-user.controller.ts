import { ListRecurringIncomesUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListRecurringIncomesByUserController implements IController<AuthenticatedHttpRequest> {
  constructor(private readonly useCase: ListRecurringIncomesUseCase) {}

  async handle(request: AuthenticatedHttpRequest): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.userId);
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

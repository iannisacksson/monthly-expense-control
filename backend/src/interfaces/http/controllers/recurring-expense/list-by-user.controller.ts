import { ListRecurringExpensesUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListRecurringExpensesByUserController implements IController<AuthenticatedHttpRequest> {
  constructor(private readonly useCase: ListRecurringExpensesUseCase) {}

  async handle(request: AuthenticatedHttpRequest): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.userId);
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

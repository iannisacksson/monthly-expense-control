import type { CreateRecurringExpenseDTO } from "../../../../dtos/recurring-expense.dto"
import { CreateRecurringExpenseUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateRecurringExpenseController implements IController<
  AuthenticatedHttpRequest<CreateRecurringExpenseDTO>
> {
  constructor(private readonly useCase: CreateRecurringExpenseUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateRecurringExpenseDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);
    return { statusCode: HttpStatusCode.CREATED, body: result };
  }
}

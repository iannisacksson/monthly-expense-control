import type { UpdateRecurringExpenseDTO } from "../../../../dtos/recurring-expense.dto"
import { UpdateRecurringExpenseUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateRecurringExpenseController implements IController<
  AuthenticatedHttpRequest<UpdateRecurringExpenseDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateRecurringExpenseUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<
      UpdateRecurringExpenseDTO,
      { id: string }
    >,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

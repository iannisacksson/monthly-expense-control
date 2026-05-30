import type { UpdateRecurringExpenseDTO } from "../../../../dtos/recurring-expense.dto"
import { DeleteRecurringExpenseUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class DeleteRecurringExpenseController implements IController<
  AuthenticatedHttpRequest<UpdateRecurringExpenseDTO, { id: string }>,
  { success: boolean }
> {
  constructor(private readonly useCase: DeleteRecurringExpenseUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<
      UpdateRecurringExpenseDTO,
      { id: string }
    >,
  ): Promise<HttpResponse<{ success: boolean }>> {
    await this.useCase.execute(request.params.id, request.body, request.userId);
    return { statusCode: HttpStatusCode.OK, body: { success: true } };
  }
}

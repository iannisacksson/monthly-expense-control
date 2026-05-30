import { DeleteRecurringIncomeUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class DeleteRecurringIncomeController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>,
  { success: boolean }
> {
  constructor(private readonly useCase: DeleteRecurringIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse<{ success: boolean }>> {
    await this.useCase.execute(request.params.id, request.userId);
    return { statusCode: HttpStatusCode.OK, body: { success: true } };
  }
}

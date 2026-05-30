import { DeleteExpenseItemUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class DeleteExpenseItemController implements IController<
  AuthenticatedHttpRequest<unknown, { itemId: string }>,
  { success: boolean }
> {
  constructor(private readonly useCase: DeleteExpenseItemUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { itemId: string }>,
  ): Promise<HttpResponse<{ success: boolean }>> {
    await this.useCase.execute(request.params.itemId, request.userId);
    return { statusCode: HttpStatusCode.OK, body: { success: true } };
  }
}

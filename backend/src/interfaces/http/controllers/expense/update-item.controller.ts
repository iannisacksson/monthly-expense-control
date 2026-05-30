import type { UpdateExpenseItemDTO } from "../../../../dtos/expense-item.dto"
import { UpdateExpenseItemUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateExpenseItemController implements IController<
  AuthenticatedHttpRequest<UpdateExpenseItemDTO, { itemId: string }>
> {
  constructor(private readonly useCase: UpdateExpenseItemUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateExpenseItemDTO, { itemId: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.itemId,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

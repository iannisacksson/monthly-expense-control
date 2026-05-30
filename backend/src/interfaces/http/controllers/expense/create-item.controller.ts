import type { CreateExpenseItemDTO } from "../../../../dtos/expense-item.dto"
import { CreateExpenseItemUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateExpenseItemController implements IController<
  AuthenticatedHttpRequest<CreateExpenseItemDTO, { id: string }>
> {
  constructor(private readonly useCase: CreateExpenseItemUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateExpenseItemDTO, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.CREATED, body: result };
  }
}

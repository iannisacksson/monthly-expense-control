import type { BulkDeleteExpensesDTO } from "../../../../dtos/expense.dto"
import { BulkDeleteExpensesUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class BulkDeleteExpensesController implements IController<
  AuthenticatedHttpRequest<BulkDeleteExpensesDTO>
> {
  constructor(private readonly useCase: BulkDeleteExpensesUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<BulkDeleteExpensesDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

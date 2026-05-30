import type { BulkMarkExpensesPaidDTO } from "../../../../dtos/expense.dto"
import { BulkMarkExpensesPaidUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class BulkMarkExpensesPaidController implements IController<
  AuthenticatedHttpRequest<BulkMarkExpensesPaidDTO>
> {
  constructor(private readonly useCase: BulkMarkExpensesPaidUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<BulkMarkExpensesPaidDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

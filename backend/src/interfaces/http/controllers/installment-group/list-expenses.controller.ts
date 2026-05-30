import { ListInstallmentGroupExpensesUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListExpensesByInstallmentGroupController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>
> {
  constructor(private readonly useCase: ListInstallmentGroupExpensesUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

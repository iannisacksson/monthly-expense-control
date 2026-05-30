import type { UpdateRecurringIncomeDTO } from "../../../../dtos/recurring-income.dto"
import { UpdateRecurringIncomeUseCase } from "../../../../application/use-cases/recurring-income.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateRecurringIncomeController implements IController<
  AuthenticatedHttpRequest<UpdateRecurringIncomeDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateRecurringIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateRecurringIncomeDTO, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

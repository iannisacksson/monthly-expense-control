import type { RestoreRecurringExpenseOccurrenceDTO } from "../../../../dtos/recurring-expense.dto"
import { RestoreRecurringExpenseOccurrenceUseCase } from "../../../../application/use-cases/recurring-expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class RestoreRecurringExpenseOccurrenceController implements IController<
  AuthenticatedHttpRequest<RestoreRecurringExpenseOccurrenceDTO, { id: string }>
> {
  constructor(
    private readonly useCase: RestoreRecurringExpenseOccurrenceUseCase,
  ) {}

  async handle(
    request: AuthenticatedHttpRequest<
      RestoreRecurringExpenseOccurrenceDTO,
      { id: string }
    >,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.CREATED, body: result };
  }
}

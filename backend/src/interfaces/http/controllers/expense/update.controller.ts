import type { UpdateExpenseDTO } from "../../../../dtos/expense.dto"
import { UpdateExpenseUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateExpenseController implements IController<
  AuthenticatedHttpRequest<UpdateExpenseDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateExpenseUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateExpenseDTO, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

import type { CreateExpenseDTO } from "../../../../dtos/expense.dto"
import { CreateExpenseUseCase } from "../../../../application/use-cases/expense.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateExpenseController implements IController<
  AuthenticatedHttpRequest<CreateExpenseDTO>
> {
  constructor(private readonly useCase: CreateExpenseUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateExpenseDTO>,
  ): Promise<HttpResponse> {
    const { user_id: _ignored, ...body } = request.body;
    const result = await this.useCase.execute({
      ...body,
      user_id: request.userId,
    });
    return { statusCode: HttpStatusCode.CREATED, body: result };
  }
}

import type { CreateMonthDTO } from "../../../../dtos/month.dto";
import { CreateMonthUseCase } from "../../../../application/use-cases/month.use-cases";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateMonthController implements IController<
  AuthenticatedHttpRequest<CreateMonthDTO>
> {
  constructor(private readonly useCase: CreateMonthUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateMonthDTO>,
  ): Promise<HttpResponse> {
    const { user_id: _ignored, ...body } = request.body;
    const result = await this.useCase.execute({
      ...body,
      user_id: request.userId,
    });

    return {
      statusCode: HttpStatusCode.CREATED,
      body: result,
    };
  }
}

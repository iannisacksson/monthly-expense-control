import { UpdateMonthUseCase } from "../../../../application/use-cases/month.use-cases"
import type { UpdateMonthDTO } from "../../../../dtos/month.dto"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateMonthController implements IController<
  AuthenticatedHttpRequest<UpdateMonthDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateMonthUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateMonthDTO, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

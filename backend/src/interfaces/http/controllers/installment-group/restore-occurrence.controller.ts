import type { RestoreInstallmentOccurrenceDTO } from "../../../../dtos/installment-group.dto"
import { RestoreInstallmentOccurrenceUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class RestoreInstallmentOccurrenceController implements IController<
  AuthenticatedHttpRequest<RestoreInstallmentOccurrenceDTO, { id: string }>
> {
  constructor(private readonly useCase: RestoreInstallmentOccurrenceUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<
      RestoreInstallmentOccurrenceDTO,
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

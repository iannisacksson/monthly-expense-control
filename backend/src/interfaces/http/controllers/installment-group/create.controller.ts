import type { CreateInstallmentGroupDTO } from "../../../../dtos/installment-group.dto";
import { CreateInstallmentGroupUseCase } from "../../../../application/use-cases/installment-group.use-cases";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateInstallmentGroupController implements IController<
  AuthenticatedHttpRequest<CreateInstallmentGroupDTO>
> {
  constructor(private readonly useCase: CreateInstallmentGroupUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateInstallmentGroupDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);
    return { statusCode: HttpStatusCode.CREATED, body: result };
  }
}

import type { UpdateInstallmentGroupDTO } from "../../../../dtos/installment-group.dto"
import { UpdateInstallmentGroupUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateInstallmentGroupController implements IController<
  AuthenticatedHttpRequest<UpdateInstallmentGroupDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateInstallmentGroupUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<
      UpdateInstallmentGroupDTO,
      { id: string }
    >,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

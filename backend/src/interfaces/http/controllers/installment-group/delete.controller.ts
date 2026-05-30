import type { UpdateInstallmentGroupDTO } from "../../../../dtos/installment-group.dto"
import { DeleteInstallmentGroupUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class DeleteInstallmentGroupController implements IController<
  AuthenticatedHttpRequest<UpdateInstallmentGroupDTO, { id: string }>,
  { success: boolean }
> {
  constructor(private readonly useCase: DeleteInstallmentGroupUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<
      UpdateInstallmentGroupDTO,
      { id: string }
    >,
  ): Promise<HttpResponse<{ success: boolean }>> {
    await this.useCase.execute(request.params.id, request.body, request.userId);
    return { statusCode: HttpStatusCode.OK, body: { success: true } };
  }
}

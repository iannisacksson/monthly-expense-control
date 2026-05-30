import { ListInstallmentGroupsUseCase } from "../../../../application/use-cases/installment-group.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListInstallmentGroupsByUserController implements IController<AuthenticatedHttpRequest> {
  constructor(private readonly useCase: ListInstallmentGroupsUseCase) {}

  async handle(request: AuthenticatedHttpRequest): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.userId);
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

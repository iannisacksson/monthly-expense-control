import { DeleteIncomeTaxUseCase } from "../../../../application/use-cases/income-tax.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class DeleteIncomeTaxController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>,
  { success: boolean }
> {
  constructor(private readonly useCase: DeleteIncomeTaxUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse<{ success: boolean }>> {
    await this.useCase.execute(request.params.id, request.userId);

    return {
      statusCode: HttpStatusCode.OK,
      body: { success: true },
    };
  }
}

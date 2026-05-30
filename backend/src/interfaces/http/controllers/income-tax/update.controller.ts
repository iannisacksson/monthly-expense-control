import type { UpdateIncomeTaxDTO } from "../../../../dtos/income-tax.dto";
import { UpdateIncomeTaxUseCase } from "../../../../application/use-cases/income-tax/update.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateIncomeTaxController implements IController<
  AuthenticatedHttpRequest<UpdateIncomeTaxDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateIncomeTaxUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateIncomeTaxDTO, { id: string }>,
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

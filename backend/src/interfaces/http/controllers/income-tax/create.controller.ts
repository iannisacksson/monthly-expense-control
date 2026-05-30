import type { CreateIncomeTaxDTO } from "../../../../dtos/income-tax.dto";
import { CreateIncomeTaxUseCase } from "../../../../application/use-cases/income-tax/create.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateIncomeTaxController implements IController<
  AuthenticatedHttpRequest<CreateIncomeTaxDTO>
> {
  constructor(private readonly useCase: CreateIncomeTaxUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateIncomeTaxDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);

    return {
      statusCode: HttpStatusCode.CREATED,
      body: result,
    };
  }
}

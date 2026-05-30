import type { CreateSubcategoryDTO } from "../../../../dtos/subcategory.dto";
import { CreateSubcategoryUseCase } from "../../../../application/use-cases/subcategory.use-cases";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateSubcategoryController implements IController<
  AuthenticatedHttpRequest<CreateSubcategoryDTO>
> {
  constructor(private readonly useCase: CreateSubcategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateSubcategoryDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);

    return {
      statusCode: HttpStatusCode.CREATED,
      body: result,
    };
  }
}

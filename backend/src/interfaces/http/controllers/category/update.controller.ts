import type { UpdateCategoryDTO } from "../../../../dtos/category.dto"
import { UpdateCategoryUseCase } from "../../../../application/use-cases/category/update.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateCategoryController implements IController<
  AuthenticatedHttpRequest<UpdateCategoryDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateCategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateCategoryDTO, { id: string }>,
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

import type { CreateCategoryDTO } from "../../../../dtos/category.dto"
import { CreateCategoryUseCase } from "../../../../application/use-cases/category/create.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateCategoryController implements IController<
  AuthenticatedHttpRequest<CreateCategoryDTO>
> {
  constructor(private readonly useCase: CreateCategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateCategoryDTO>,
  ): Promise<HttpResponse> {
    const { user_id: _ignored, ...body } = request.body;
    const result = await this.useCase.execute({
      ...body,
      user_id: request.userId,
    });

    return {
      statusCode: HttpStatusCode.CREATED,
      body: result,
    };
  }
}

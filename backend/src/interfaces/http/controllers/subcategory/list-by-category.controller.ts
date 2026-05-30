import { ListSubcategoriesByCategoryUseCase } from "../../../../application/use-cases/subcategory/list-by-category.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListSubcategoriesByCategoryController implements IController<
  AuthenticatedHttpRequest<unknown, { categoryId: string }>
> {
  constructor(private readonly useCase: ListSubcategoriesByCategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { categoryId: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.categoryId,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

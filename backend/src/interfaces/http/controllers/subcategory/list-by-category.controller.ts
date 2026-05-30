import { ListSubcategoriesUseCase } from "../../../../application/use-cases/subcategory.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListSubcategoriesByCategoryController implements IController<
  AuthenticatedHttpRequest<unknown, { categoryId: string }>
> {
  constructor(private readonly useCase: ListSubcategoriesUseCase) {}

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

import { ListCategoriesByUserUseCase } from "../../../../application/use-cases/category/list-by-user.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type { AuthenticatedHttpRequest, HttpResponse, IController } from "../../http.types";
import { CategoryResponse, toCategoryResponse } from "./category.response";

export class ListCategoriesByUserController implements IController<AuthenticatedHttpRequest, CategoryResponse[]> {
  constructor(private readonly useCase: ListCategoriesByUserUseCase) {}

  async handle(request: AuthenticatedHttpRequest): Promise<HttpResponse<CategoryResponse[]>> {
    const result = await this.useCase.execute(request.userId);

    return {
      statusCode: HttpStatusCode.OK,
      body: result.map(toCategoryResponse),
    };
  }
}


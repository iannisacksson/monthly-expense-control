import { GetCategoryByIdUseCase } from "../../../../application/use-cases/category/get-by-id.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type { AuthenticatedHttpRequest, HttpResponse, IController } from "../../http.types";
import { CategoryResponse, toCategoryResponse } from "./category.response";

export class GetCategoryByIdController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>,
  CategoryResponse
> {
  constructor(private readonly useCase: GetCategoryByIdUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse<CategoryResponse>> {
    const result = await this.useCase.execute(
      request.params.id,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: toCategoryResponse(result),
    };
  }
}


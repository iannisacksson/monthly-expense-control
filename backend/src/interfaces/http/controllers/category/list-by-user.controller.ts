import { ListCategoriesByUserUseCase } from "../../../../application/use-cases/category/list-by-user.use-case";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { CategoryResponse } from "./category.response";

export class ListCategoriesByUserController implements IController<
  AuthenticatedHttpRequest,
  CategoryResponse[]
> {
  constructor(private readonly useCase: ListCategoriesByUserUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest,
  ): Promise<HttpResponse<CategoryResponse[]>> {
    const user = new UserEntity({
      id: request.userId,
    });

    const result = await this.useCase.execute(user);

    const response = result.map((category) => new CategoryResponse(category));

    return {
      statusCode: HttpStatusCode.OK,
      body: response,
    };
  }
}

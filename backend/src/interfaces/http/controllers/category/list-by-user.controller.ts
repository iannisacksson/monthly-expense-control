import { ListCategoriesUseCase } from "../../../../application/use-cases/category.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListCategoriesByUserController implements IController<AuthenticatedHttpRequest> {
  constructor(private readonly useCase: ListCategoriesUseCase) {}

  async handle(request: AuthenticatedHttpRequest): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.userId);

    return {
      statusCode: HttpStatusCode.OK,
      body: result,
    };
  }
}

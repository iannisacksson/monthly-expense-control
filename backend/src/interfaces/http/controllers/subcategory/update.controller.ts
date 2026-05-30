import type { UpdateSubcategoryDTO } from "../../../../dtos/subcategory.dto"
import { UpdateSubcategoryUseCase } from "../../../../application/use-cases/subcategory.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateSubcategoryController implements IController<
  AuthenticatedHttpRequest<UpdateSubcategoryDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateSubcategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateSubcategoryDTO, { id: string }>,
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

import { IsUUID } from "class-validator";
import { GetCategoryByIdUseCase } from "../../../../application/use-cases/category/get-by-id.use-case";
import { Validation } from "../../../../utils/validation";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { CategoryResponse } from "./category.response";

type TGetCategoryByIdParams = {
  id: string;
};

class GetCategoryByIdParams
  extends Validation<TGetCategoryByIdParams>
  implements TGetCategoryByIdParams
{
  @IsUUID()
  id: string;

  constructor(data: TGetCategoryByIdParams) {
    super(data);
  }
}

export class GetCategoryByIdController implements IController<
  AuthenticatedHttpRequest<GetCategoryByIdParams>,
  CategoryResponse
> {
  constructor(private readonly useCase: GetCategoryByIdUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<GetCategoryByIdParams>,
  ): Promise<HttpResponse<CategoryResponse>> {
    const payload = new GetCategoryByIdParams({
      id: request.params.id,
    });

    const result = await this.useCase.execute(payload.id, request.userId);

    const response = new CategoryResponse(result);

    return {
      statusCode: HttpStatusCode.OK,
      body: response,
    };
  }
}

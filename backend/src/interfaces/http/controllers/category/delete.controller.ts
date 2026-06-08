import { IsUUID } from "class-validator";
import { DeleteCategoryUseCase } from "../../../../application/use-cases/category/delete.use-case";
import { Validation } from "../../../../utils/validation";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

type TDeleteCategoryParams = {
  id: string;
};

class DeleteCategoryBody extends Validation<TDeleteCategoryParams> {
  @IsUUID()
  id: string;

  constructor(data: TDeleteCategoryParams) {
    super(data);
  }
}

export class DeleteCategoryController implements IController<
  AuthenticatedHttpRequest<DeleteCategoryBody>
> {
  constructor(private readonly useCase: DeleteCategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<DeleteCategoryBody>,
  ): Promise<HttpResponse> {
    await this.useCase.execute(request.params.id, request.userId);

    return {
      statusCode: HttpStatusCode.OK,
      body: { success: true },
    };
  }
}

import { GetSubcategoryByIdUseCase } from "../../../../application/use-cases/subcategory/get-by-id.use-case";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import {
  SubcategoryResponse,
  toSubcategoryResponse,
} from "./subcategory.response";

export class GetSubcategoryByIdController implements IController<
  AuthenticatedHttpRequest<unknown, { id: string }>,
  SubcategoryResponse
> {
  constructor(private readonly useCase: GetSubcategoryByIdUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { id: string }>,
  ): Promise<HttpResponse<SubcategoryResponse>> {
    const result = await this.useCase.execute(
      request.params.id,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: toSubcategoryResponse(result),
    };
  }
}

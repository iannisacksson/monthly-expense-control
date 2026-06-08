import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { UpdateCategoryUseCase } from "../../../../application/use-cases/category/update.use-case";
import { CategoryType } from "../../../../domain/entities/category.entity";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { CategoryResponse } from "./category.response";
import { Validation } from "../../../../utils/validation";

type TUpdateCategoryBody = {
  name?: string;
  type?: CategoryType;
};

class UpdateCategoryBody
  extends Validation<TUpdateCategoryBody>
  implements TUpdateCategoryBody
{
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: "Category name must be between 2 and 100 characters",
  })
  @MaxLength(100, {
    message: "Category name must be between 2 and 100 characters",
  })
  name?: string;

  @IsOptional()
  @IsEnum(CategoryType, { message: "Invalid category type" })
  type?: CategoryType;
}

export class UpdateCategoryController implements IController<
  AuthenticatedHttpRequest<UpdateCategoryBody, { id: string }>,
  CategoryResponse
> {
  constructor(private readonly useCase: UpdateCategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateCategoryBody, { id: string }>,
  ): Promise<HttpResponse<CategoryResponse>> {
    const playload = new UpdateCategoryBody({
      name: request.body.name,
      type: request.body.type,
    });

    const result = await this.useCase.execute(
      request.params.id,
      playload,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: new CategoryResponse(result),
    };
  }
}

import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  validate,
} from "class-validator";
import { plainToInstance } from "class-transformer";
import { UpdateCategoryUseCase } from "../../../../application/use-cases/category/update.use-case";
import { CategoryType } from "../../../../domain/entities/category.entity";
import { BadRequestError } from "../../../../utils/errors";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { CategoryResponse, toCategoryResponse } from "./category.response";

class UpdateCategoryBody {
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
    const body = plainToInstance(UpdateCategoryBody, request.body);
    const errors = await validate(body);
    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints ?? {})[0];
      throw new BadRequestError(message);
    }

    const result = await this.useCase.execute(
      request.params.id,
      body,
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: toCategoryResponse(result),
    };
  }
}

import { IsEnum, IsString, MaxLength, MinLength, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateCategoryUseCase } from "../../../../application/use-cases/category/create.use-case";
import { CategoryType } from "../../../../domain/entities/category.entity";
import { BadRequestError } from "../../../../utils/errors";
import { HttpStatusCode } from "../../http-status-code";
import type { AuthenticatedHttpRequest, HttpResponse, IController } from "../../http.types";
import { CategoryResponse, toCategoryResponse } from "./category.response";

class CreateCategoryBody {
  @IsString()
  @MinLength(2, { message: "Category name must be between 2 and 100 characters" })
  @MaxLength(100, { message: "Category name must be between 2 and 100 characters" })
  name: string;

  @IsEnum(CategoryType, { message: "Invalid category type" })
  type: CategoryType;
}

export class CreateCategoryController implements IController<
  AuthenticatedHttpRequest<CreateCategoryBody>,
  CategoryResponse
> {
  constructor(private readonly useCase: CreateCategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateCategoryBody>,
  ): Promise<HttpResponse<CategoryResponse>> {
    const body = plainToInstance(CreateCategoryBody, request.body);
    const errors = await validate(body);
    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints ?? {})[0];
      throw new BadRequestError(message);
    }

    const result = await this.useCase.execute({
      name: body.name,
      type: body.type,
      userId: request.userId,
    });

    return {
      statusCode: HttpStatusCode.CREATED,
      body: toCategoryResponse(result),
    };
  }
}


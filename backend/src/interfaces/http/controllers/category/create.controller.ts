import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateCategoryUseCase } from "../../../../application/use-cases/category/create.use-case";
import {
  CategoryEntity,
  CategoryType,
} from "../../../../domain/entities/category.entity";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { CategoryResponse } from "./category.response";
import { Validation } from "../../../../utils/validation";
import { UserEntity } from "../../../../domain/entities/user.entity";

type TCreateCategoryBody = {
  name: string;
  type: CategoryType;
};

class CreateCategoryBody extends Validation<TCreateCategoryBody> {
  @IsString()
  @MinLength(2, {
    message: "Category name must be between 2 and 100 characters",
  })
  @MaxLength(100, {
    message: "Category name must be between 2 and 100 characters",
  })
  name: string;

  @IsEnum(CategoryType, { message: "Invalid category type" })
  type: CategoryType;

  constructor(data: TCreateCategoryBody) {
    super(data);
  }
}

export class CreateCategoryController implements IController<
  AuthenticatedHttpRequest<CreateCategoryBody>,
  CategoryResponse
> {
  constructor(private readonly useCase: CreateCategoryUseCase) {}

  async handle({
    body,
    userId,
  }: AuthenticatedHttpRequest<CreateCategoryBody>): Promise<
    HttpResponse<CategoryResponse>
  > {
    const payload = new CreateCategoryBody({
      name: body.name,
      type: body.type,
    });

    const category = new CategoryEntity({
      name: payload.name,
      type: payload.type,
    });
    const requestedUser = new UserEntity({ id: userId });

    const result = await this.useCase.execute(category, requestedUser);

    return {
      statusCode: HttpStatusCode.CREATED,
      body: new CategoryResponse(result),
    };
  }
}

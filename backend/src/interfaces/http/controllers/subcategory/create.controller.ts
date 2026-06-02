import { plainToInstance } from "class-transformer";
import {
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  validate,
} from "class-validator";
import { CreateSubcategoryUseCase } from "../../../../application/use-cases/subcategory/create.use-case";
import type { CreateSubcategoryDTO } from "../../../../dtos/subcategory.dto";
import { BadRequestError } from "../../../../utils/errors";
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

class CreateSubcategoryBody implements CreateSubcategoryDTO {
  @IsUUID()
  category_id: string;

  @IsString()
  @MinLength(2, {
    message: "Subcategory name must be between 2 and 100 characters",
  })
  @MaxLength(100, {
    message: "Subcategory name must be between 2 and 100 characters",
  })
  name: string;
}

export class CreateSubcategoryController implements IController<
  AuthenticatedHttpRequest<CreateSubcategoryBody>,
  SubcategoryResponse
> {
  constructor(private readonly useCase: CreateSubcategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateSubcategoryBody>,
  ): Promise<HttpResponse<SubcategoryResponse>> {
    const body = plainToInstance(CreateSubcategoryBody, request.body);
    const errors = await validate(body);

    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints ?? {})[0];
      throw new BadRequestError(message);
    }

    const result = await this.useCase.execute(body, request.userId);

    return {
      statusCode: HttpStatusCode.CREATED,
      body: toSubcategoryResponse(result),
    };
  }
}

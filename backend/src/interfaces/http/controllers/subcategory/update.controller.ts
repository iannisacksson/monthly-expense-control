import { plainToInstance } from "class-transformer";
import { IsOptional, IsString, MaxLength, MinLength, validate } from "class-validator";
import { UpdateSubcategoryUseCase } from "../../../../application/use-cases/subcategory/update.use-case";
import type { UpdateSubcategoryDTO } from "../../../../dtos/subcategory.dto";
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

class UpdateSubcategoryBody implements UpdateSubcategoryDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: "Subcategory name must be between 2 and 100 characters",
  })
  @MaxLength(100, {
    message: "Subcategory name must be between 2 and 100 characters",
  })
  name?: string;
}

export class UpdateSubcategoryController implements IController<
  AuthenticatedHttpRequest<UpdateSubcategoryBody, { id: string }>,
  SubcategoryResponse
> {
  constructor(private readonly useCase: UpdateSubcategoryUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateSubcategoryBody, { id: string }>,
  ): Promise<HttpResponse<SubcategoryResponse>> {
    const body = plainToInstance(UpdateSubcategoryBody, request.body);
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
      body: toSubcategoryResponse(result),
    };
  }
}

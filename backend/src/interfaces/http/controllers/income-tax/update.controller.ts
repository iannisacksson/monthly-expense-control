import { plainToInstance } from "class-transformer";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  validate,
} from "class-validator";
import { UpdateIncomeTaxUseCase } from "../../../../application/use-cases/income-tax/update.use-case";
import type { UpdateIncomeTaxDTO } from "../../../../dtos/income-tax.dto";
import { BadRequestError } from "../../../../utils/errors";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import {
  IncomeTaxResponse,
  toIncomeTaxResponse,
} from "./income-tax.response";

class UpdateIncomeTaxBody implements UpdateIncomeTaxDTO {
  @IsOptional()
  @IsString()
  tax_type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Tax value must be greater than or equal to zero" })
  value?: number;

  @IsOptional()
  @IsBoolean()
  is_auto?: boolean;
}

export class UpdateIncomeTaxController implements IController<
  AuthenticatedHttpRequest<UpdateIncomeTaxBody, { id: string }>,
  IncomeTaxResponse
> {
  constructor(private readonly useCase: UpdateIncomeTaxUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateIncomeTaxBody, { id: string }>,
  ): Promise<HttpResponse<IncomeTaxResponse>> {
    const body = plainToInstance(UpdateIncomeTaxBody, request.body);
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
      body: toIncomeTaxResponse(result),
    };
  }
}

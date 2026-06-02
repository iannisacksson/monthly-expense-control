import { plainToInstance } from "class-transformer";
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  validate,
} from "class-validator";
import { CreateIncomeTaxUseCase } from "../../../../application/use-cases/income-tax/create.use-case";
import type { CreateIncomeTaxDTO } from "../../../../dtos/income-tax.dto";
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

class CreateIncomeTaxBody implements CreateIncomeTaxDTO {
  @IsUUID()
  monthly_income_id: string;

  @IsString()
  tax_type: string;

  @IsNumber()
  @Min(0, { message: "Tax value must be greater than or equal to zero" })
  value: number;

  @IsBoolean()
  is_auto: boolean;
}

export class CreateIncomeTaxController implements IController<
  AuthenticatedHttpRequest<CreateIncomeTaxBody>,
  IncomeTaxResponse
> {
  constructor(private readonly useCase: CreateIncomeTaxUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateIncomeTaxBody>,
  ): Promise<HttpResponse<IncomeTaxResponse>> {
    const body = plainToInstance(CreateIncomeTaxBody, request.body);
    const errors = await validate(body);

    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints ?? {})[0];
      throw new BadRequestError(message);
    }

    const result = await this.useCase.execute(body, request.userId);

    return {
      statusCode: HttpStatusCode.CREATED,
      body: toIncomeTaxResponse(result),
    };
  }
}

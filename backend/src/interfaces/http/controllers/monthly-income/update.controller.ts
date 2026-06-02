import { plainToInstance } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  validate,
} from "class-validator";
import { UpdateMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income/update.use-case";
import type { UpdateMonthlyIncomeDTO } from "../../../../dtos/monthly-income.dto";
import { BadRequestError } from "../../../../utils/errors";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { serializeMonthlyIncome } from "./monthly-income.serializer";

class UpdateBody {
  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: "Income amount must be greater than zero" })
  gross_income?: number;

  @IsOptional()
  @IsString()
  income_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: "Income notes must be at most 255 characters" })
  notes?: string;

  taxation?: UpdateMonthlyIncomeDTO["taxation"];
}

export class UpdateMonthlyIncomeController implements IController<
  AuthenticatedHttpRequest<UpdateBody, { id: string }>
> {
  constructor(private readonly useCase: UpdateMonthlyIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateBody, { id: string }>,
  ): Promise<HttpResponse> {
    const body = plainToInstance(UpdateBody, request.body);
    const errors = await validate(body);

    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints ?? {})[0];
      throw new BadRequestError(message);
    }

    const { gross_income, income_type, notes, taxation } = body;

    const result = await this.useCase.execute(
      request.params.id,
      {
        grossIncome: gross_income,
        incomeType: income_type,
        notes,
        taxation,
      },
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: serializeMonthlyIncome(result),
    };
  }
}

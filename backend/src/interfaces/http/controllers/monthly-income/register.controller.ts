import { plainToInstance } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  validate,
} from "class-validator";
import { RegisterMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income/register.use-case";
import type { CreateMonthlyIncomeDTO } from "../../../../dtos/monthly-income.dto";
import { BadRequestError } from "../../../../utils/errors";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";
import { serializeMonthlyIncome } from "./monthly-income.serializer";

class RegisterBody {
  @IsUUID()
  month_id: string;

  @IsOptional()
  @IsUUID()
  recurring_income_id?: string;

  @IsNumber()
  @Min(0.01, { message: "Income amount must be greater than zero" })
  gross_income: number;

  @IsString()
  income_type: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: "Income notes must be at most 255 characters" })
  notes?: string;

  taxation?: CreateMonthlyIncomeDTO["taxation"];
}

export class RegisterMonthlyIncomeController implements IController<
  AuthenticatedHttpRequest<RegisterBody>
> {
  constructor(private readonly useCase: RegisterMonthlyIncomeUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<RegisterBody>,
  ): Promise<HttpResponse> {
    const body = plainToInstance(RegisterBody, request.body);
    const errors = await validate(body);

    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints ?? {})[0];
      throw new BadRequestError(message);
    }

    const {
      month_id,
      recurring_income_id,
      gross_income,
      income_type,
      notes,
      taxation,
    } = body;

    const result = await this.useCase.execute(
      {
        userId: request.userId,
        monthId: month_id,
        recurringIncomeId: recurring_income_id,
        grossIncome: gross_income,
        incomeType: income_type,
        notes,
        taxation,
      },
      request.userId,
    );

    return {
      statusCode: HttpStatusCode.CREATED,
      body: serializeMonthlyIncome(result),
    };
  }
}

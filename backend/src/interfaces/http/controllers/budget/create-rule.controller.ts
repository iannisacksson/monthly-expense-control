import type { CreateBudgetRuleDTO } from "../../../../dtos/budget-rule.dto"
import { CreateBudgetRuleUseCase } from "../../../../application/use-cases/budget.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateBudgetRuleController implements IController<
  AuthenticatedHttpRequest<CreateBudgetRuleDTO>
> {
  constructor(private readonly useCase: CreateBudgetRuleUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateBudgetRuleDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);
    return { statusCode: HttpStatusCode.CREATED, body: result };
  }
}

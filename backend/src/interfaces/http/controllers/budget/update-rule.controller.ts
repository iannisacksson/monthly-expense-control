import type { UpdateBudgetRuleDTO } from "../../../../dtos/budget-rule.dto";
import { UpdateBudgetRuleUseCase } from "../../../../application/use-cases/budget-rule/budget.use-cases";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateBudgetRuleController implements IController<
  AuthenticatedHttpRequest<UpdateBudgetRuleDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateBudgetRuleUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateBudgetRuleDTO, { id: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

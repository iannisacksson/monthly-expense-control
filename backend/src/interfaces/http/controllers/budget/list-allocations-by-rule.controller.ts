import { ListBudgetAllocationsUseCase } from "../../../../application/use-cases/budget-rule/budget.use-cases";
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListBudgetAllocationsByRuleController implements IController<
  AuthenticatedHttpRequest<unknown, { ruleId: string }>
> {
  constructor(private readonly useCase: ListBudgetAllocationsUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<unknown, { ruleId: string }>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.ruleId,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

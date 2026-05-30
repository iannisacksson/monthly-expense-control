import { ListBudgetRulesUseCase } from "../../../../application/use-cases/budget.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class ListBudgetRulesByUserController implements IController<AuthenticatedHttpRequest> {
  constructor(private readonly useCase: ListBudgetRulesUseCase) {}

  async handle(request: AuthenticatedHttpRequest): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.userId);
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

import type { CreateBudgetAllocationDTO } from "../../../../dtos/budget-allocation.dto"
import { CreateBudgetAllocationUseCase } from "../../../../application/use-cases/budget.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class CreateBudgetAllocationController implements IController<
  AuthenticatedHttpRequest<CreateBudgetAllocationDTO>
> {
  constructor(private readonly useCase: CreateBudgetAllocationUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<CreateBudgetAllocationDTO>,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId);
    return { statusCode: HttpStatusCode.CREATED, body: result };
  }
}

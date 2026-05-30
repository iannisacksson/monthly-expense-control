import type { UpdateBudgetAllocationDTO } from "../../../../dtos/budget-allocation.dto"
import { UpdateBudgetAllocationUseCase } from "../../../../application/use-cases/budget.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateBudgetAllocationController implements IController<
  AuthenticatedHttpRequest<UpdateBudgetAllocationDTO, { id: string }>
> {
  constructor(private readonly useCase: UpdateBudgetAllocationUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<
      UpdateBudgetAllocationDTO,
      { id: string }
    >,
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute(
      request.params.id,
      request.body,
      request.userId,
    );
    return { statusCode: HttpStatusCode.OK, body: result };
  }
}

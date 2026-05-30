import type { UpdateProfileDTO } from "../../../../dtos/auth.dto"
import { UpdateAuthenticatedProfileUseCase } from "../../../../application/use-cases/auth.use-cases"
import { HttpStatusCode } from "../../http-status-code";
import type {
  AuthenticatedHttpRequest,
  HttpResponse,
  IController,
} from "../../http.types";

export class UpdateMeController implements IController<
  AuthenticatedHttpRequest<UpdateProfileDTO>
> {
  constructor(private readonly useCase: UpdateAuthenticatedProfileUseCase) {}

  async handle(
    request: AuthenticatedHttpRequest<UpdateProfileDTO>,
  ): Promise<HttpResponse> {
    const { name, email, password } = request.body;
    const user = await this.useCase.execute(request.userId, {
      name,
      email,
      password,
    });

    return {
      statusCode: HttpStatusCode.OK,
      body: user,
    };
  }
}

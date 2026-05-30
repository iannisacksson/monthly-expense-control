import type { LoginDTO, RegisterDTO, UpdateProfileDTO } from "../../dtos/auth.dto"
import type { AuthRequestContext } from "../../utils/request-context"
import { AuthService } from "../../services/auth.service"

const authService = new AuthService()

export class RegisterUserUseCase {
  execute(data: RegisterDTO) {
    return authService.register(data)
  }
}

export class LoginUserUseCase {
  execute(data: LoginDTO, context: AuthRequestContext) {
    return authService.login(data, context)
  }
}

export class RefreshSessionUseCase {
  execute(refreshToken: string, context: AuthRequestContext) {
    return authService.refresh(refreshToken, context)
  }
}

export class LogoutUserUseCase {
  execute(refreshToken: string | null, sessionId: string | null, context: AuthRequestContext) {
    return authService.logout(refreshToken, sessionId, context)
  }
}

export class GetAuthenticatedProfileUseCase {
  execute(userId: string) {
    return authService.getMe(userId)
  }
}

export class UpdateAuthenticatedProfileUseCase {
  execute(userId: string, data: UpdateProfileDTO) {
    return authService.updateMe(userId, data)
  }
}

export class DeleteAuthenticatedProfileUseCase {
  execute(userId: string) {
    return authService.deleteMe(userId)
  }
}

export class ReadSessionIdFromAccessTokenUseCase {
  execute(token: string) {
    return authService.readAccessTokenSessionId(token)
  }
}
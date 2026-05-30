import type { CreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto"
import { UserService } from "../../services/user.service"

const userService = new UserService()

export class CreateUserUseCase { execute(data: CreateUserDTO) { return userService.createUser(data) } }
export class GetUserByIdUseCase { execute(id: string) { return userService.findUserById(id) } }
export class UpdateUserUseCase { execute(id: string, data: UpdateUserDTO) { return userService.updateUser(id, data) } }
export class DeleteUserUseCase { execute(id: string) { return userService.deleteUser(id) } }
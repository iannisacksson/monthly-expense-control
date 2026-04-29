export interface CreateUserDTO {
  name: string
  email: string
  password_hash: string
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  password_hash?: string
}

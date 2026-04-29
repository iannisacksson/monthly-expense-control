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

export interface UserPublicDTO {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

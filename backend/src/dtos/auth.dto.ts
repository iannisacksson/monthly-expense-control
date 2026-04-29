export interface RegisterDTO {
  name: string
  email: string
  password: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface UpdateProfileDTO {
  name?: string
  email?: string
  password?: string
}

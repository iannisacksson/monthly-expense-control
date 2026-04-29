export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  password?: string;
}

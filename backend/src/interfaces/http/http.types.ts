export interface HttpResponse<TBody = unknown> {
  statusCode: number
  body: TBody
  bodyType?: "json" | "text"
  headers?: Record<string, string>
  authCookies?: {
    accessToken: string
    refreshToken: string
  }
  clearAuthCookies?: boolean
}

export interface HttpRequest<TBody = unknown, TParams extends Record<string, string> = Record<string, string>> {
  body: TBody
  params: TParams
}

export interface AuthenticatedHttpRequest<TBody = unknown, TParams extends Record<string, string> = Record<string, string>> {
  body: TBody
  params: TParams
  userId: string
}

import type { NextFunction, Request, RequestHandler, Response } from "express"
import { clearAuthCookies, setAuthCookies } from "../../utils/auth-cookies"
import { AppError, ForbiddenError, UnauthorizedError } from "../../utils/errors"
import type { AuthenticatedHttpRequest, HttpRequest, HttpResponse } from "./http.types"

type HttpController<TRequest, TResponse> = (request: TRequest) => Promise<HttpResponse<TResponse>> | HttpResponse<TResponse>
type HttpErrorNormalizer = (error: unknown) => unknown

export function requireAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new UnauthorizedError("Missing authenticated user")
  }

  return req.user.id
}

export function buildAuthenticatedHttpRequest<TBody = unknown, TParams extends Record<string, string> = Record<string, string>>(
  req: Request,
  overrides?: Partial<AuthenticatedHttpRequest<TBody, TParams>>,
): AuthenticatedHttpRequest<TBody, TParams> {
  return {
    body: (overrides?.body ?? req.body) as TBody,
    params: (overrides?.params ?? req.params) as TParams,
    userId: overrides?.userId ?? requireAuthenticatedUserId(req),
  }
}

export function buildHttpRequest<TBody = unknown, TParams extends Record<string, string> = Record<string, string>>(
  req: Request,
  overrides?: Partial<HttpRequest<TBody, TParams>>,
): HttpRequest<TBody, TParams> {
  return {
    body: (overrides?.body ?? req.body) as TBody,
    params: (overrides?.params ?? req.params) as TParams,
  }
}

export function adaptExpressRoute<TRequest, TResponse>(
  controller: HttpController<TRequest, TResponse>,
  mapRequest: (req: Request) => TRequest,
  normalizeError?: HttpErrorNormalizer,
  onError?: (res: Response, error: unknown) => void,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controller(mapRequest(req)))
      .then((response) => {
        if (response.clearAuthCookies) {
          clearAuthCookies(res)
        }

        if (response.authCookies) {
          setAuthCookies(res, response.authCookies.accessToken, response.authCookies.refreshToken)
        }

        if (response.headers) {
          for (const [name, value] of Object.entries(response.headers)) {
            res.setHeader(name, value)
          }
        }

        if (response.bodyType === "text") {
          res.status(response.statusCode).send(response.body)
          return
        }

        res.status(response.statusCode).json(response.body)
      })
      .catch((error) => {
        onError?.(res, error)
        next(normalizeError ? normalizeError(error) : error)
      })
  }
}

export function withFallbackErrorStatus(
  fallbackStatusCode: number,
  overrides: Record<string, number> = {},
): HttpErrorNormalizer {
  return (error: unknown) => {
    if (error instanceof AppError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
      return error
    }

    if (!(error instanceof Error)) {
      return error
    }

    const overrideStatusCode = overrides[error.message]
    return new AppError(error.message, overrideStatusCode ?? fallbackStatusCode)
  }
}

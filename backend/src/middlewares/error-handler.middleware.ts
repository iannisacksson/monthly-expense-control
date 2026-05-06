import type { NextFunction, Request, Response } from "express"
import { resolveErrorMessage, resolveErrorStatusCode } from "../utils/errors"

export function errorHandlerMiddleware(error: unknown, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(error)
    return
  }

  const statusCode = resolveErrorStatusCode(error)
  const message = resolveErrorMessage(error)

  req.log?.[statusCode >= 500 ? "error" : "warn"](
    {
      err: error,
      method: req.method,
      route: req.originalUrl || req.url,
      statusCode,
    },
    "http_request_failed"
  )

  res.status(statusCode).json({ error: message })
}
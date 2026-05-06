export class AppError extends Error {
  readonly statusCode: number
  readonly expose: boolean

  constructor(message: string, statusCode = 500, expose = true) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
    this.expose = expose
  }
}

export class ForbiddenError extends Error {
  readonly statusCode = 403

  constructor(message = "Forbidden") {
    super(message)
    this.name = "ForbiddenError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, true)
    this.name = "UnauthorizedError"
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, true)
    this.name = "BadRequestError"
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, true)
    this.name = "NotFoundError"
  }
}

export function resolveErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) return error.statusCode
  if (error instanceof ForbiddenError) return error.statusCode
  if (error instanceof SyntaxError) return 400
  return 500
}

export function resolveErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message
  if (error instanceof ForbiddenError) return error.message
  if (error instanceof SyntaxError) return "Invalid JSON payload"
  return "Internal server error"
}

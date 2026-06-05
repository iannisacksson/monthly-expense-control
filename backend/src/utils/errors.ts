import { HttpStatusCode } from "../interfaces/http/http-status-code";

export class AppError extends Error {
  readonly statusCode: number;
  readonly expose: boolean;

  constructor(message: string, statusCode = 500, expose = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.expose = expose;
  }
}

export class ForbiddenError extends Error {
  readonly statusCode = HttpStatusCode.FORBIDDEN;

  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, HttpStatusCode.UNAUTHORIZED, true);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, HttpStatusCode.BAD_REQUEST, true);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, HttpStatusCode.NOT_FOUND, true);
    this.name = "NotFoundError";
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable Entity") {
    super(message, HttpStatusCode.UNPROCESSABLE_ENTITY, true);
    this.name = "UnprocessableEntityError";
  }
}

export function resolveErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) return error.statusCode;
  if (error instanceof ForbiddenError) return error.statusCode;
  if (error instanceof SyntaxError) return HttpStatusCode.BAD_REQUEST;
  return HttpStatusCode.INTERNAL_SERVER_ERROR;
}

export function resolveErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof ForbiddenError) return error.message;
  if (error instanceof SyntaxError) return "Invalid JSON payload";
  return "Internal server error";
}

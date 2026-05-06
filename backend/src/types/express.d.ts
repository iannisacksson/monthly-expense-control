import "express"
import type { Logger } from "pino"

declare module "express" {
  interface Request {
    log?: Logger
    requestId?: string
    user?: {
      id: string
      email: string
      sessionId: string
    }
  }
}

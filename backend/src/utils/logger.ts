import pino from "pino"
import { getAppName, getLogLevel } from "../config/observability.config"

export const logger = pino({
  name: getAppName(),
  level: getLogLevel(),
  base: {
    service: getAppName(),
    env: process.env.NODE_ENV ?? "development",
  },
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      "refreshToken",
      "accessToken",
      "password",
      "password_hash",
      "token",
    ],
    censor: "[Redacted]",
  },
})
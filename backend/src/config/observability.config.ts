export function getLogLevel(): string {
  if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL
  if (process.env.NODE_ENV === "test") return "silent"
  return process.env.NODE_ENV === "production" ? "info" : "debug"
}

export function getAppName(): string {
  return process.env.APP_NAME ?? "monthly-expense-control-backend"
}

export function isMetricsEnabled(): boolean {
  return process.env.METRICS_ENABLED !== "false"
}
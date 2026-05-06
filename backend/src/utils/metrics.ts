import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client"
import { getAppName, isMetricsEnabled } from "../config/observability.config"

export const metricsRegistry = new Registry()

metricsRegistry.setDefaultLabels({
  service: getAppName(),
  env: process.env.NODE_ENV ?? "development",
})

if (isMetricsEnabled()) {
  collectDefaultMetrics({ register: metricsRegistry })
}

export const httpRequestDurationSeconds = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [metricsRegistry],
})

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [metricsRegistry],
})
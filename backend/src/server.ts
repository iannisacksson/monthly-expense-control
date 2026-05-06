import dotenv from "dotenv"

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  override: process.env.NODE_ENV === "test",
})

import app from "./app"
import { logger } from "./utils/logger"

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info({ port: Number(PORT), env: process.env.NODE_ENV ?? "development" }, "server_started")
})

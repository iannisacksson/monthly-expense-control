import dotenv from "dotenv"
dotenv.config({
	path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
	override: process.env.NODE_ENV === "test",
})

import express from "express"
import routes from "./interfaces/http/routes";
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import { buildCorsOptions, buildHelmetOptions, getTrustProxySetting } from "./config/security.config"
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware"
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware"

const app = express()

app.set("trust proxy", getTrustProxySetting())
app.use(requestLoggerMiddleware)
app.use(helmet(buildHelmetOptions()))
app.use(cors(buildCorsOptions()))
app.use(cookieParser())
app.use(express.json())

app.use("/api/v1", routes)
app.use(errorHandlerMiddleware)

export default app

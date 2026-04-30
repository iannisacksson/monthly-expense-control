import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  override: process.env.NODE_ENV === "test",
})

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "test" ? false : undefined,
  }
)

require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  override: process.env.NODE_ENV === "test",
});

const buildConfig = () => ({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  dialect: "postgres",
});

module.exports = {
  development: buildConfig(),
  test: buildConfig(),
  production: buildConfig(),
};
